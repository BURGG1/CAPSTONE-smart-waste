#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>
#include <TinyGPSPlus.h>

#define SS_PIN 5
#define RST_PIN 22
#define RELAY_PIN 26
#define GPS_RX 16  // ESP32 RX2 ← Neo-7M TX
#define GPS_TX 17  // ESP32 TX2 → Neo-7M RX
#define GPS_BAUD 9600

// ── HC-SR04 ultrasonic sensor (bin fill level) ─────────────────────────────
#define TRIG_PIN 32
#define ECHO_PIN 33

#define BIN_HEIGHT_CM 40.0    // distance from sensor to bottom of empty bin — measure & adjust
#define SENSOR_OFFSET_CM 2.0  // dead zone near the sensor

#define FILL_READ_INTERVAL_MS 3000       // how often to sample the sensor
#define FILL_SEND_INTERVAL_MS 10000      // how often to POST fill level to server
#define LOCATION_SEND_INTERVAL_MS 30000  // report location every 30s, regardless of scans
#define GPS_DEBUG_INTERVAL_MS 10000       // how often to print GPS diagnostics

MFRC522 mfrc522(SS_PIN, RST_PIN);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);  // UART2

const char* ssid = "H";
const char* password = "eeeeeeee";
const char* scanURL = "http://192.168.43.208:5000/api/rfid/scan-bin";
const char* locationURL = "http://192.168.43.208:5000/api/devices/location";
const char* binStatusURL = "http://192.168.43.208:5000/api/devices/fill-level";
const char* BIN_ID = "BIN-001";

// ── Timers for non-blocking loops ───────────────────────────────────────────
unsigned long lastFillRead = 0;
unsigned long lastFillSend = 0;
unsigned long lastLocationSend = 0;
unsigned long lastGpsDebug = 0;

// ── Latest sensor state, shared across the whole program ──────────────────
volatile float latestDistanceCm = -1.0;
volatile int latestFillPercent = -1;

// ── Feed GPS without blocking (call every loop) ────────────────────────────
void feedGPS() {
  while (gpsSerial.available())
    gps.encode(gpsSerial.read());
}

// ── Print GPS diagnostics so we can tell wiring vs no-fix-yet apart ───────
void printGpsDebug() {
  Serial.println("── GPS Debug ──────────────────────────────");
  Serial.printf("Chars processed : %lu\n", gps.charsProcessed());
  Serial.printf("Sentences w/fix : %lu\n", gps.sentencesWithFix());
  Serial.printf("Failed checksum : %lu\n", gps.failedChecksum());
  Serial.printf("Satellites      : %d\n", gps.satellites.isValid() ? gps.satellites.value() : -1);
  Serial.printf("HDOP            : %s\n", gps.hdop.isValid() ? String(gps.hdop.hdop()).c_str() : "n/a");
  Serial.printf("Location valid  : %s\n", gps.location.isValid() ? "yes" : "no");

  if (gps.charsProcessed() < 10) {
    Serial.println(" Almost no data received — check wiring (TX↔RX crossed?) and baud rate.");
  } else if (!gps.location.isValid()) {
    Serial.println("ℹ️  Module is talking, just no satellite fix yet — try outdoors/near a window, may take a few minutes.");
  }
  Serial.println("────────────────────────────────────────────");
}

// ── Measure distance from HC-SR04 in cm (-1 if no echo received) ──────────
float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout ≈ 5m max
  if (duration == 0) return -1.0;

  return duration * 0.0343 / 2.0;
}

// ── Take a few quick readings and return the median ────────────────────────
float getStableDistanceCm() {
  float readings[5];
  int count = 0;

  for (int i = 0; i < 5; i++) {
    float d = readDistanceCm();
    if (d > 0) readings[count++] = d;
    delay(20);  // short, doesn't meaningfully block the rest of the loop
  }

  if (count == 0) return -1.0;

  for (int i = 1; i < count; i++) {
    float key = readings[i];
    int j = i - 1;
    while (j >= 0 && readings[j] > key) {
      readings[j + 1] = readings[j];
      j--;
    }
    readings[j + 1] = key;
  }

  return readings[count / 2];
}

// ── Convert raw distance to a 0-100% fill level ────────────────────────────
int calcFillPercent(float distanceCm) {
  if (distanceCm < 0) return -1;

  float usableHeight = BIN_HEIGHT_CM - SENSOR_OFFSET_CM;
  float fillDepth = (BIN_HEIGHT_CM - distanceCm) - SENSOR_OFFSET_CM;

  if (fillDepth < 0) fillDepth = 0;
  if (fillDepth > usableHeight) fillDepth = usableHeight;

  return (int)((fillDepth / usableHeight) * 100.0);
}

// ── Send current fill level to server ───────────────────────────────────────
void sendFillLevel() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, skipping fill-level send");
    return;
  }
  if (latestFillPercent < 0) {
    Serial.println("No valid fill reading yet, skipping send");
    return;
  }

  HTTPClient http;
  http.begin(binStatusURL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"deviceId\":\"" + String(BIN_ID) + "\",";
  payload += "\"fillLevel\":" + String(latestFillPercent) + ",";
  payload += "\"distanceCm\":" + String(latestDistanceCm, 1) + "}";

  int responseCode = http.POST(payload);
  Serial.println("Fill-level sent: " + payload + " → code " + String(responseCode));

  http.end();
}

void sendLocationPing() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, skipping location ping");
    return;
  }
  if (!gps.location.isValid() || gps.location.age() > 5000) {
    Serial.println("No valid GPS fix yet, skipping location ping");
    return;
  }

  double lat = gps.location.lat();
  double lng = gps.location.lng();

  
  HTTPClient http;
  http.begin(locationURL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"deviceId\":\"" + String(BIN_ID) + "\",";
  payload += "\"lat\":" + String(lat, 6) + ",";
  payload += "\"lng\":" + String(lng, 6) + "}";

  int responseCode = http.POST(payload);
  Serial.println("Location ping: " + payload + " → code " + String(responseCode));

  http.end();
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, GPS_RX, GPS_TX);
  Serial.println("GPS initialized on UART2");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);
  Serial.println("HC-SR04 initialized");

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed. Restarting...");
    ESP.restart();
  }

  Serial.print("Bin ID: ");
  Serial.println(BIN_ID);
  Serial.println("Ready — scan RFID card...");
}

void loop() {
  unsigned long now = millis();

  // ── 1. Keep GPS buffer draining every loop (non-blocking) ────────────────
  feedGPS();

  // ── 1b. Periodic GPS diagnostics ───────────────────────────────────────────
  if (now - lastGpsDebug >= GPS_DEBUG_INTERVAL_MS) {
    lastGpsDebug = now;
    printGpsDebug();
  }

  // ── 2. Sample the ultrasonic sensor on its own timer ──────────────────────
  if (now - lastFillRead >= FILL_READ_INTERVAL_MS) {
    lastFillRead = now;
    float d = getStableDistanceCm();
    latestDistanceCm = d;
    latestFillPercent = calcFillPercent(d);

    if (latestFillPercent >= 0) {
      Serial.printf("Distance: %.1f cm | Fill level: %d%%\n", latestDistanceCm, latestFillPercent);
    } else {
      Serial.println(" Ultrasonic sensor error");
    }
  }

  // ── 3. Push fill level to server on its own timer ─────────────────────────
  if (now - lastFillSend >= FILL_SEND_INTERVAL_MS) {
    lastFillSend = now;
    sendFillLevel();
  }

  if (now - lastLocationSend >= LOCATION_SEND_INTERVAL_MS) {
    lastLocationSend = now;
    sendLocationPing();
  }

  // ── 4. RFID scan handling (unchanged logic, still uses latest fill data) ──
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) uid += "-";
  }
  uid.toUpperCase();

  Serial.println("\nCard Detected! UID: " + uid);
  Serial.println("Bin: " + String(BIN_ID));

  // Give GPS a moment to catch up before reading location
  unsigned long gpsStart = millis();
  while (millis() - gpsStart < 500) {
    feedGPS();
  }

  double lat = 0.0;
  double lng = 0.0;
  bool hasGPS = false;

  if (gps.location.isValid() && gps.location.age() < 5000) {
    lat = gps.location.lat();
    lng = gps.location.lng();
    hasGPS = true;
    Serial.printf("GPS: %.6f, %.6f\n", lat, lng);
  } else {
    Serial.println("GPS not locked — sending without coordinates");
  }

  bool hasFill = (latestFillPercent >= 0);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(scanURL);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"rfid\":\"" + uid + "\",";
    payload += "\"binId\":\"" + String(BIN_ID) + "\"";

    if (hasGPS) {
      payload += ",\"lat\":" + String(lat, 6);
      payload += ",\"lng\":" + String(lng, 6);
    }

    if (hasFill) {
      payload += ",\"fillLevel\":" + String(latestFillPercent);
      payload += ",\"distanceCm\":" + String(latestDistanceCm, 1);
    }

    payload += "}";

    Serial.println("Sending: " + payload);

    int responseCode = http.POST(payload);
    String response = http.getString();

    Serial.println("Response Code: " + String(responseCode));
    Serial.println("Response: " + response);

    if (responseCode == 200) {
      Serial.println("Scan logged at " + String(BIN_ID));
      digitalWrite(RELAY_PIN, LOW);
      delay(3000);
      digitalWrite(RELAY_PIN, HIGH);
    } else if (responseCode == 404) {
      Serial.println("RFID not registered.");
    } else {
      Serial.println(" Server error: " + String(responseCode));
    }

    http.end();
  } else {
    Serial.println(" WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
  }

  delay(2000);
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}