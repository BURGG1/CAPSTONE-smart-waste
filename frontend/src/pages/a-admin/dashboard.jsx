import {
    Users,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Search, Filter
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const householdRecords = [
    {
        id: "HH-24680135",
        name: "Dela Cruz Family",
        address: "Green St.",
        disposals: 48,
        points: 1240,
        status: "compliant",
    },
    {
        id: "HH-13579246",
        name: "Santos Family",
        address: "Sunshine Ave.",
        disposals: 35,
        points: 920,
        status: "compliant",
    },
    {
        id: "HH-86420975",
        name: "Reyes Household",
        address: "Eco Lane",
        disposals: 22,
        points: 450,
        status: "warning",
    },
    {
        id: "HH-97531468",
        name: "Garcia Family",
        address: "Clean Rd.",
        disposals: 12,
        points: 180,
        status: "non-compliant",
    },
    {
        id: "HH-75391482",
        name: "Martinez Family",
        address: "Fresh Blvd.",
        disposals: 41,
        points: 1050,
        status: "compliant",
    },
    {
        id: "HH-15948673",
        name: "Lopez Household",
        address: "Nature St.",
        disposals: 18,
        points: 380,
        status: "warning",
    },
    {
        id: "HH-25948673",
        name: "Lopez Household",
        address: "Nature St.",
        disposals: 18,
        points: 380,
        status: "warning",
    },
];


// Stat cards
const stats = [
    {
        title: "Total Households",
        value: 6,
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        percentage: null,
    },
    {
        title: "Compliant",
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
        title: "Non-Compliant",
        value: 1,
        icon: XCircle,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        percentage: "17%",
        percentColor: "text-red-600",
    },
];

// Pie chart data
const wasteDistribution = [
    { name: "Biodegradable", value: 45, color: "#10b981" },
    { name: "Non-biodegradable", value: 30, color: "#f97316" },
    { name: "Recyclable", value: 25, color: "#3b82f6" },
];

// Bar chart data
const monthlyCompliance = [
    { month: "Jan", compliant: 85, nonCompliant: 15 },
    { month: "Feb", compliant: 88, nonCompliant: 12 },
    { month: "Mar", compliant: 92, nonCompliant: 8 },
    { month: "Apr", compliant: 90, nonCompliant: 10 },
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





export default function ComplianceDashboard() {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredData = householdRecords.filter((h) => {
        const matchSearch =
            h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.id.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "all" || h.status === filter;

        return matchSearch && matchFilter;
    });


    return (
        <div className="flex-1">
            <Navbar />

            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                <main className="w-full p-4 sm:p-6 space-y-6">
                    <section className="flex flex-col gap-5">
                        {/* Header */}
                        <div>
                            <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                                Waste bin Segregation Management
                            </h1>
                            <p className="text-gray-500 text-xs sm:text-lg ">
                                Monitor household waste segregation compliance
                            </p>
                        </div>

                        {/* Stat Cards */}
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

                        {/* Charts */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <div className="bg-white rounded-xl shadow-sm  p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Waste Segregation Distribution
                                </h3>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height={256}>
                                        <PieChart>
                                            <Pie
                                                data={wasteDistribution}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                label={({ name, value }) => `${name} ${value}%`}
                                            >
                                                {wasteDistribution.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Monthly Compliance Trend
                                </h3>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height={256}>
                                        <BarChart data={monthlyCompliance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="compliant"
                                                fill="#10b981"
                                                name="Compliant %"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="nonCompliant"
                                                fill="#ef4444"
                                                name="Non-Compliant %"
                                                radius={[6, 6, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="bg-white rounded-2xl shadow p-6">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                Household Records
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search households..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="compliant">Compliant</option>
                                        <option value="warning">Warning</option>
                                        <option value="non-compliant">Non‑Compliant</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold">Household ID</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Address</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Disposals</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Points</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.address}</td>
                                            <td className="px-4 py-3">{item.disposals}</td>
                                            <td className="px-4 py-3 font-bold text-green-600">
                                                {item.points}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[item.status]}`}
                                                >
                                                    {statusIcons[item.status]}
                                                    {item.status.replace("-", " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
