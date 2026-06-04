import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

const bins = [
  {
    id: "BIN-001",
    location: "Rizal St.",
    fill: 85,
    capacity: "500L",
    lat: 14.86313,
    lng: 120.7508,
  },
  {
    id: "BIN-002",
    location: "Mabini St.",
    fill: 60,
    capacity: "500L",
    lat: 14.8645,
    lng: 120.7515,
  },
];

export default function BinLocationMap() {
  const getStatusFromFill = (fill: number) => {
    if (fill >= 90) return "critical";
    if (fill >= 61) return "warning";
    return "good";
  };

  const statusColors: any = {
    good: "bg-green-600",
    warning: "bg-yellow-500",
    critical: "bg-red-600",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      {/* MAIN CONTAINER */}
      <View className="flex-1 bg-white p-2">

        {/* HEADER */}
        <View className="flex-row items-center gap-2 mb-4">
          <Feather name="map-pin" color="green" size={20} />
          <View>
            <Text className="font-semibold text-3xl">
              Bin Location Map
            </Text>
            <Text className="text-gray-500 text-sm">
              Live view of all smart bin locations
            </Text>
          </View>
        </View>

       
        <View style={{ flex: 1, gap: 12 }}>

          {/* MAP  */}
          <View style={{ flex: 2 }} className="rounded-xl overflow-hidden border">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 14.86313,
                longitude: 120.7508,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {bins.map((bin) => {
                const status = getStatusFromFill(bin.fill);

                return (
                  <Marker
                    key={bin.id}
                    coordinate={{
                      latitude: bin.lat,
                      longitude: bin.lng,
                    }}
                  >
                    <Callout>
                      <View style={{ width: 160 }}>

                        <Text style={{ fontWeight: "600" }}>
                          {bin.id}
                        </Text>

                        <Text style={{ color: "#6b7280", fontSize: 12 }}>
                          {bin.location}
                        </Text>

                        <View style={{ marginTop: 6 }}>
                          <Text style={{ fontSize: 12 }}>
                            Fill Level
                          </Text>

                          <View
                            style={{
                              backgroundColor: "#e5e7eb",
                              height: 6,
                              borderRadius: 4,
                              marginTop: 4,
                            }}
                          >
                            <View
                              style={{
                                width: `${bin.fill}%`,
                                height: 6,
                                borderRadius: 4,
                                backgroundColor:
                                  status === "good"
                                    ? "green"
                                    : status === "warning"
                                    ? "orange"
                                    : "red",
                              }}
                            />
                          </View>

                          <Text style={{ fontSize: 11, marginTop: 3 }}>
                            {bin.fill}%
                          </Text>
                        </View>

                        <Text style={{ fontSize: 11, marginTop: 6 }}>
                          Capacity: {bin.capacity}
                        </Text>

                      </View>
                    </Callout>
                  </Marker>
                );
              })}
            </MapView>
          </View>

          {/* BIN LIST
          <ScrollView
            style={{ flex: 1 }}
            className="w-full border rounded-xl p-3"
          >
            <Text className="font-semibold mb-3">
              Bins in Barangay
            </Text>

            {bins.map((bin) => {
              const status = getStatusFromFill(bin.fill);

              return (
                <View
                  key={bin.id}
                  className="mb-3 p-3 border rounded-lg"
                >
                  <View className="flex-row justify-between">
                    <Text className="font-medium">{bin.id}</Text>
                    <Text>{bin.fill}%</Text>
                  </View>

                  <Text className="text-xs text-gray-500">
                    {bin.location}
                  </Text>

                  <View className="bg-gray-200 h-2 rounded mt-2">
                    <View
                      className={`h-2 rounded ${statusColors[status]}`}
                      style={{ width: `${bin.fill}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView> */}

        </View>
      </View>
    </SafeAreaView>
  );
}