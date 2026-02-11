import Navbar from "../../components/Navbar";
import NavigationShell from "../../navigation/mainNav";

import {
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bell,
  MapPin,
  Calendar,
  TrendingUp,
  Trash,
} from "lucide-react";

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

const alertData = {
  title: "Urgent: Bins Require Immediate Attention!",
  description: "1 bin has reached maximum capacity",
  location: "Eco Lane",
};

const stats = [
  {
    title: "Total Bins",
    value: 6,
    icon: Trash,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    percentage: null,
  },
  {
    title: "Normal",
    value: 3,
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    percentage: "50%",
    percentColor: "text-green-600",
  },
  {
    title: "Warning",
    value: 2,
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    percentage: "33%",
    percentColor: "text-yellow-600",
  },
  {
    title: "Critical",
    value: 1,
    icon: XCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    percentage: "17%",
    percentColor: "text-red-600",
  },
];

const statusStyles = {
  compliant: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  "non-compliant": "bg-red-100 text-red-700",
};

const statusIcons = {
  compliant: <CheckCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  "non-compliant": <XCircle size={16} />,
};

const bins = [
  {
    id: "BIN-001",
    location: "Rizal St.",
    type: "Biodegradable",
    fill: 85,
    capacity: "500L",
    lastEmptied: "2026-01-23 08:00 AM",
  },
  {
    id: "BIN-002",
    location: "Mabini St.",
    type: "Biodegradable",
    fill: 60,
    capacity: "500L",
    lastEmptied: "2026-01-24 10:30 AM",
  },
  {
    id: "BIN-003",
    location: "Luna St.",
    type: "Biodegradable",
    fill: 92,
    capacity: "500L",
    lastEmptied: "2026-01-22 02:00 PM",
  },
  {
    id: "BIN-004",
    location: "Rizal St.",
    type: "Non-biodegradable",
    fill: 30,
    capacity: "500L",
    lastEmptied: "2026-01-24 09:15 AM",
  },
  {
    id: "BIN-005",
    location: "Mabini St.",
    type: "Non-biodegradable",
    fill: 78,
    capacity: "500L",
    lastEmptied: "2026-01-23 11:00 AM",
  },
  {
    id: "BIN-006",
    location: "Luna St.",
    type: "Non-biodegradable",
    fill: 15,
    capacity: "500L",
    lastEmptied: "2026-01-24 07:45 AM",
  },
];

function getStatusFromFill(fill) {
  if (fill >= 90) return "critical";
  if (fill >= 61) return "warning";
  return "good";
}

export default function BinMonitoring() {

  return (
    <div className="flex-1">
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <NavigationShell />

        <main className="w-full p-4 sm:p-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-lg sm:text-3xl font-bold">
              Bin Fill Capacity Monitoring
            </h1>
            <p className="text-gray-500 text-xl sm:text-lg">
              Monitor smart bin capacity across the community
            </p>
          </div>

          {/* ALERT */}
          {/* <div className="border border-red-300 bg-red-50 rounded-xl p-5 flex justify-between items-start">
            <div className="flex gap-3">
              <Bell className="text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-700">
                  {alertData.title}
                </h3>
                <p className="text-sm text-red-600">
                  {alertData.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs rounded-full bg-red-600 text-white">
                  <MapPin size={14} />
                  {alertData.location}
                </span>
              </div>
            </div>
            <button className="text-red-400 text-xl">&times;</button>
          </div> */}

          {/* STATS */}
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
                        <Icon className={`${item.iconColor}`} />
                      </div>
                      {item.percentage && (
                        <span
                          className={`text-sm font-medium ${item.percentColor}`}
                        >
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

          {/* BIN CARDS */}
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
                      <h3 className="font-bold">{bin.id}</h3>
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {bin.location}
                      </p>
                    </div>
                    <StatusIcon className={`${style.iconColor}`} />
                  </div>

                  <span
                    className={`mt-3 inline-block px-3 py-1 text-xs text-white rounded-full ${typeColors[bin.type]}`}
                  >
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
                    <p className="flex items-center gap-1">
                      Last Emptied:<strong>{bin.lastEmptied}</strong>
                    </p>
                  </div>

                  <span
                    className={`mt-4 inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${style.badge}`}
                  >
                    <StatusIcon size={14} />
                    Status: {status}
                  </span>

                  {status !== "good" && (
                    <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      Schedule Collection
                    </button>

                  )}
                </div>
              );
            })}
          </div>
          {/* Status Indicator */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Status Indicators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

              <div className="flex gap-2">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className=" font-bold">Normal (0–60%)</p>
                  <p className="text-sm text-gray-500">Bin operating normally</p>
                </div>

              </div>

              <div className="flex gap-2">

                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold">Warning (61–89%)</p>
                  <p className="text-sm text-gray-500"> Collection needed soon</p>
                </div>
              </div>

              <div className="flex gap-2">

                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="text-red-600" />
                </div>
                <div>
                  <p className="font-bold">Critical (90–100%)</p>
                  <p className="text-sm text-gray-500"> Immediate collection required</p>
                </div>


              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
