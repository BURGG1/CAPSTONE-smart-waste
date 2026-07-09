import Navbar from "../../components/Navbar";
import NavigationShell from "../../navigation/mainNav";
import SetSched from "../../components/setCollectionSched";
import Footer from "../../components/Footer";
import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import BASE_URL from "../../config";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bell,
  MapPin,
  Trash,
} from "lucide-react";

const API = `${BASE_URL}/api/bins`;
const SCHEDULE_API = `${BASE_URL}/api/bins`; // -> /:binId/schedule

// How often to re-fetch bins from the server. Matches the ESP32's
// FILL_SEND_INTERVAL_MS (10s) so the dashboard stays roughly live.
const POLL_INTERVAL_MS = 10000;

const statusColors = {
  good: {
    border: "border-green-300",
    badge: "bg-green-100 text-green-700",
    bar: "bg-green-600",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  warning: {
    border: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-700",
    bar: "bg-yellow-500",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  critical: {
    border: "border-red-300",
    badge: "bg-red-100 text-red-700",
    bar: "bg-red-600",
    icon: XCircle,
    iconColor: "text-red-600",
  },
};

const typeColors = {
  Biodegradable: "bg-green-600",
  "Non-biodegradable": "bg-orange-600",
  Recyclable: "bg-blue-600",
};

function getStatusFromFill(fill) {
  if (fill >= 90) return "critical";
  if (fill >= 61) return "warning";
  return "good";
}

const initialCollectors = [
  { id: 1, name: "Juan Carlos", status: "available", currentLoad: 1 },
  { id: 2, name: "Pedro Penduko", status: "available", currentLoad: 2 },
  { id: 3, name: "Maria Teresa", status: "busy", currentLoad: 2 },
];

export default function BinMonitoring() {
  const [bins, setBins] = useState([]);
  const [binsLoading, setBinsLoading] = useState(true);
  const [activeBinId, setActiveBinId] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [collectors, setCollectors] = useState(initialCollectors);

  // Keep a ref mirror of bins so the polling interval always sees the
  // latest schedules without having to be re-created on every bins change.
  const binsRef = useRef(bins);
  useEffect(() => {
    binsRef.current = bins;
  }, [bins]);

  // ── Fetch bins from database ──────────────────────────────────────────────
  // On the very first load there is nothing to preserve, so we just map
  // the payload straight in. On every subsequent poll we merge the fresh
  // fill/lastEmptied data into the bins we already have, so we don't
  // clobber locally-set schedules with server data that doesn't know
  // about them yet.
  const fetchBins = useCallback(async (isInitial = false) => {
    if (isInitial) setBinsLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (!data.success) return;

      const prevById = new Map(binsRef.current.map((b) => [b.id, b]));

      const nextBins = data.data.map((bin) => {
        const prev = prevById.get(bin.binId);
        return {
          id: bin.binId,
          _id: bin._id,
          name: bin.name,
          location: bin.location,
          type: bin.type,
          fill: bin.fill ?? 0,
          capacity: bin.capacity,
          lastEmptied: bin.lastEmptied ? new Date(bin.lastEmptied) : null,
          // Preserve any schedule we already know about locally, unless
          // the server tells us about one directly.
          schedule: bin.schedule ?? prev?.schedule ?? null,
          lat: bin.lat ?? 14.86515,
          lng: bin.lng ?? 120.75615,
        };
      });

      setBins(nextBins);
    } catch (err) {
      console.error("Failed to fetch bins:", err);
    } finally {
      if (isInitial) setBinsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBins(true);
    const interval = setInterval(() => fetchBins(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchBins]);

  // ── Assign the least-loaded available collector ──────────────────────────
  const assignCollector = useCallback(() => {
    let assigned = null;
    setCollectors((prev) => {
      const available = prev
        .filter((c) => c.status === "available")
        .sort((a, b) => a.currentLoad - b.currentLoad);
      if (available.length === 0) return prev;

      assigned = available[0];
      return prev.map((c) =>
        c.id === assigned.id ? { ...c, currentLoad: c.currentLoad + 1 } : c
      );
    });
    return assigned;
  }, []);

  // ── Auto-schedule critical bins ───────────────────────────────────────────
  const autoScheduleBins = useCallback(() => {
    setBins((prevBins) => {
      let updated = false;
      const newBins = prevBins.map((bin) => {
        const status = getStatusFromFill(bin.fill);
        if ((status === "warning" || status === "critical") && !bin.schedule) {
          const collector = assignCollector();
          if (!collector) return bin;
          updated = true;
          return {
            ...bin,
            schedule: {
              collector: collector.name,
              date: new Date().toLocaleDateString(),
              auto: true,
            },
          };
        }
        return bin;
      });
      return updated ? newBins : prevBins;
    });
  }, [assignCollector]);

  useEffect(() => {
    if (bins.length === 0) return;
    const needsScheduling = bins.some((bin) => bin.fill >= 90 && !bin.schedule);
    if (needsScheduling) autoScheduleBins();
  }, [bins, autoScheduleBins]);

  // ── Manual "Schedule Collection" button handler ───────────────────────────
  // This was referenced in the JSX (onConfirm) but never defined — that's
  // what was crashing the page. It posts the schedule to the backend and,
  // whether or not the request succeeds, reflects it in local state so the
  // UI updates immediately (optimistic update), rolling back on failure.
  const handleSchedule = useCallback(
    async (binId, data) => {
      const collector = data?.collector ?? assignCollector()?.name ?? "Unassigned";
      const date = data?.date ?? new Date().toLocaleDateString();
      const schedule = { collector, date, auto: false };

      // Optimistic UI update
      setBins((prev) =>
        prev.map((b) => (b.id === binId ? { ...b, schedule } : b))
      );
      setActiveBinId(null);

      try {
        const res = await fetch(`${SCHEDULE_API}/${binId}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collector, date }),
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
      } catch (err) {
        console.error("Failed to save schedule, rolling back:", err);
        setBins((prev) =>
          prev.map((b) => (b.id === binId ? { ...b, schedule: null } : b))
        );
      }
    },
    [assignCollector]
  );

  // ── Derived stats from real bins ──────────────────────────────────────────
  const totalBins = bins.length;
  const normalBins = bins.filter((b) => getStatusFromFill(b.fill) === "good").length;
  const warningBins = bins.filter((b) => getStatusFromFill(b.fill) === "warning").length;
  const criticalBins = bins.filter((b) => getStatusFromFill(b.fill) === "critical").length;
  const aveFillLevel = bins.length
    ? Math.round(bins.reduce((sum, b) => sum + b.fill, 0) / bins.length)
    : 0;

  const stats = [
    { title: "Total Bins", value: totalBins, icon: Trash, iconBg: "bg-blue-100", iconColor: "text-blue-600", percentage: null },
    { title: "Normal", value: normalBins, icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600", percentage: totalBins ? `${Math.round((normalBins / totalBins) * 100)}%` : "0%", percentColor: "text-green-600" },
    { title: "Warning", value: warningBins, icon: AlertTriangle, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", percentage: totalBins ? `${Math.round((warningBins / totalBins) * 100)}%` : "0%", percentColor: "text-yellow-600" },
    { title: "Critical", value: criticalBins, icon: XCircle, iconBg: "bg-red-100", iconColor: "text-red-600", percentage: totalBins ? `${Math.round((criticalBins / totalBins) * 100)}%` : "0%", percentColor: "text-red-600" },
  ];

  const getColor = () => {
    if (aveFillLevel >= 90) return "bg-red-500";
    if (aveFillLevel >= 61) return "bg-yellow-500";
    return "bg-green-600";
  };

  // ── Critical bins for alert ───────────────────────────────────────────────
  const criticalBinList = bins.filter((b) => getStatusFromFill(b.fill) === "critical");

  return (
    <div className="flex-1">
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">

        <div className="flex gap-4">
          <NavigationShell />
          <div className="py-2 md:hidden">
            <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
              Bin Capacity Monitoring Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-lg">
              Monitor smart bin capacity across the community
            </p>
          </div>
        </div>

        <main className="w-full p-4 sm:p-6 space-y-6">

          <div className="hidden md:block">
            <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
              Bin Capacity Monitoring Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-lg">
              Monitor smart bin capacity across the community
            </p>
          </div>

          {/* ALERT — only show if there are critical bins */}
          {criticalBinList.length > 0 && !alertDismissed && (
            <div className="border border-red-300 bg-red-50 rounded-xl p-5 flex justify-between items-start">
              <div className="flex gap-3">
                <Bell className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-700">
                    Urgent: Bins Require Immediate Attention!
                  </h3>
                  <p className="text-sm text-red-600">
                    {criticalBinList.length} bin{criticalBinList.length > 1 ? "s have" : " has"} reached maximum capacity
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criticalBinList.map((bin) => (
                      <span
                        key={bin.id}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-red-600 text-white"
                      >
                        <MapPin size={14} />
                        {bin.id} — {bin.location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAlertDismissed(true)}
                className="text-red-400 text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {/* MINI DASHBOARD */}
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="w-full bg-white rounded-xl shadow-sm p-5 flex justify-between items-center"
                >
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex justify-between">
                      <div className={`p-3 rounded-lg ${item.iconBg}`}>
                        <Icon className={item.iconColor} />
                      </div>
                      {item.percentage && (
                        <span className={`text-sm font-medium ${item.percentColor}`}>
                          {item.percentage}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AVERAGE BIN CAPACITY */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Average Fill Level</h3>
              <span className="font-bold text-xl">{aveFillLevel}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
                style={{ width: `${aveFillLevel}%` }}
              />
            </div>
          </div>

          {/* BIN CARDS */}
          {binsLoading ? (
            <p className="text-center text-gray-400 py-8">Loading bins...</p>
          ) : bins.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No bins found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bins.map((bin) => {
                const status = getStatusFromFill(bin.fill);
                const style = statusColors[status];
                const StatusIcon = style.icon;

                return (
                  <div
                    key={bin.id}
                    className={`bg-white rounded-xl border ${style.border} p-6 shadow-sm`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{bin.id} - {bin.name}</h3>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          {bin.location}
                        </p>
                      </div>
                      <StatusIcon className={style.iconColor} />
                    </div>

                    <span className={`mt-3 inline-block px-3 py-1 text-xs text-white rounded-full ${typeColors[bin.type]}`}>
                      {bin.type}
                    </span>

                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Fill Level</span>
                        <span className="font-bold">{bin.fill}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${style.bar}`}
                          style={{ width: `${bin.fill}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-sm space-y-1">
                      <p>Capacity: <strong>{bin.capacity}</strong></p>
                      <p>
                        Last Emptied:{" "}
                        <strong>
                          {bin.lastEmptied ? bin.lastEmptied.toLocaleString() : "—"}
                        </strong>
                      </p>
                    </div>

                    <span className={`mt-4 inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${style.badge}`}>
                      <StatusIcon size={14} />
                      Status: {status}
                    </span>

                    {status === "critical" && (
                      <div className="relative mt-4">
                        {!bin.schedule ? (
                          <button
                            onClick={() => setActiveBinId(bin.id)}
                            className="w-full cursor-pointer bg-gray-900 text-white py-2 rounded-lg"
                          >
                            Schedule Collection
                          </button>
                        ) : (
                          <div className="bg-green-100 p-3 rounded-lg text-sm">
                            <p><strong>Collector:</strong> {bin.schedule.collector}</p>
                            <p><strong>Date:</strong> {bin.schedule.date}</p>
                          </div>
                        )}
                        <SetSched
                          isOpen={activeBinId === bin.id}
                          onClose={() => setActiveBinId(null)}
                          onConfirm={(data) => handleSchedule(bin.id, data)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STATUS INDICATORS */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Status Indicators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex gap-2">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold">Normal (0–60%)</p>
                  <p className="text-sm text-gray-500">Bin operating normally</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold">Warning (61–89%)</p>
                  <p className="text-sm text-gray-500">Collection needed soon</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="text-red-600" />
                </div>
                <div>
                  <p className="font-bold">Critical (90–100%)</p>
                  <p className="text-sm text-gray-500">Immediate collection required</p>
                </div>
              </div>
            </div>
          </div>

          {/* BIN LOCATION MAP */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-green-600" />
              <div>
                <h3 className="font-semibold text-lg">Bin Location Map</h3>
                <p className="text-sm text-gray-500">Live view of all smart bin locations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px]">
              <div className="lg:col-span-3 rounded-xl overflow-hidden border">
                {!binsLoading && bins.length > 0 && (
                  <MapContainer
                    center={[bins[0].lat, bins[0].lng]}
                    zoom={15}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {bins.filter((bin) => bin.lat && bin.lng).map((bin) => {
                      const status = getStatusFromFill(bin.fill);
                      const style = statusColors[status];
                      return (
                        <Marker key={bin.id} position={[bin.lat, bin.lng]}>
                          <Tooltip direction="top" offset={[0, -10]} permanent>
                            {bin.id}
                          </Tooltip>
                          <Popup>
                            <div className="w-44">
                              <h3 className="font-semibold">{bin.id} - {bin.name}</h3>
                              <p className="text-sm text-gray-500">{bin.location}</p>
                              <div className="mt-2">
                                <p className="text-sm">Fill Level</p>
                                <div className="w-full bg-gray-200 h-2 rounded">
                                  <div
                                    className={`h-2 rounded ${style.bar}`}
                                    style={{ width: `${bin.fill}%` }}
                                  />
                                </div>
                                <p className="text-xs mt-1">{bin.fill}%</p>
                              </div>
                              <p className="text-xs mt-2">
                                Capacity: <strong>{bin.capacity}</strong>
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                )}
              </div>

              <div className="border rounded-xl p-3 overflow-y-auto">
                <h3 className="font-semibold mb-3">Bins in Barangay</h3>
                {bins.map((bin) => {
                  const status = getStatusFromFill(bin.fill);
                  const style = statusColors[status];
                  return (
                    <div key={bin.id} className="mb-3 p-2 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{bin.id} - {bin.name}</span>
                        <span>{bin.fill}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{bin.location}</p>
                      <div className="w-full bg-gray-200 h-2 rounded mt-1">
                        <div
                          className={`h-2 rounded ${style.bar}`}
                          style={{ width: `${bin.fill}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}