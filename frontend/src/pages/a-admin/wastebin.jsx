import { useState } from "react";
import Navbar from "../../components/Navbar";
import AssignPointsModal from "../../components/AssignPointsModal";
import NavigationShell from "../../navigation/mainNav";
import Footer from "../../components/Footer";


import {
    Trash2,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Bell,
    Star,
    MapPin,
    Search,
    Plus,
    TrendingUp,
    Filter
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

const BinInformation = [
    {
        id: "BIN-001",
        category: "Biodegradable",
        capacity: 500,
        location: "Rizal St.",
    },
    {
        id: "BIN-002",
        category: "Non-Biodegradable",
        capacity: 500,
        location: "Rizal St.",
    },
    {
        id: "BIN-003",
        category: "Biodegradable",
        capacity: 500,
        location: "Mabini St.",
    },
    {
        id: "BIN-004",
        category: "Non-Biodegradable",
        capacity: 500,
        location: "Mabini St.",
    },
    {
        id: "BIN-005",
        category: "Biodegradable",
        capacity: 500,
        location: "Bonifacio St.",
    },
    {
        id: "BIN-006",
        category: "Non-Biodegradable",
        capacity: 500,
        location: "Bonifacio St.",
    },
];



const typeColors = {
    Biodegradable: "bg-green-600",
    "Non-biodegradable": "bg-orange-600",
    Recyclable: "bg-blue-600",
};


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


function getStatusFromFill(fill) {
    if (fill >= 90) return "critical";
    if (fill >= 61) return "warning";
    return "good";
}

export default function WasteBin() {

    const [openModal, setOpenModal] = useState(false)
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("Biodegradable");
    const [capacity, setCapacity] = useState("100L");

    const filteredData = BinInformation.filter((h) => {
        const matchSearch =
            h.category.toLowerCase().includes(search.toLowerCase()) ||
            h.id.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "all" || h.category === filter;

        return matchSearch && matchFilter;
    });


    return (
        <div className="flex-1">
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
                <div className="flex gap-4">
                    {/* FOR MOBILE */}
                    <NavigationShell />
                    <div className="py-2 md:hidden">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Waste bin Segregation Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
                            Handle and Manage Smart bin Information
                        </p>
                    </div>

                </div>

                <main className="w-full p-4 sm:p-6 space-y-6">

                    <div className="hidden md:block">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Waste bin Segregation Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
                            Handle and Manage Smart bin Information
                        </p>
                    </div>

                    <section className="bg-white rounded-xl p-6 shadow">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Plus className="text-green-600" />
                            Add Bin
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* category */}
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Bin Type:</option>
                                <option value="Biodegradable">Biodegradable</option>
                                <option value="NonBiodegradable">Non-Biodegradable</option>

                            </select>
                            {/* capacity */}

                            <select
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Capacity</option>
                                <option value="100">100L</option>
                                <option value="500">500L</option>
                            </select>

                            {/* location */}

                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Bin Location</option>
                                <option value="compliant">Rizal St.</option>
                                <option value="warning">Mabini St.</option>
                                <option value="non-compliant">Bonifacio St.</option>
                            </select>

                        </div>
                        {/* Buttons */}
                        <div className="mt-3 flex justify-end  gap-2">

                            <button className="cursor-pointer px-5 mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                <Plus size={16} />
                                Add Bin
                            </button>

                            {/* <button className="cursor-pointer mt-auto bg-gray-400 flex items-center justify-center gap-1 text-black rounded-lg p-2 hover:bg-gray-500 transition">
                                Cancel
                            </button> */}

                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow p-6">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                Bin Information
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search Bin..."
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
                                        <option value="all">Category</option>
                                        <option value="Biodegradable">Biodegradable</option>
                                        <option value="Non-Biodegradable">Non-Biodegradable</option>
                                    </select>
                                </div>


                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold">Bin ID</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Bin Type</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Capacity</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Location</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                                            <td className="px-4 py-3 font-medium">{item.category}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.capacity}<span>L</span></td>
                                            <td className="px-4 py-3">{item.location}</td>
                                            <td className="flex flex-row gap-2">
                                                {/* <button className="bg-blue-300 px-3 py-1 rounded-lg">
                                                    View
                                                </button> */}
                                                <button className="bg-green-400 px-3 py-1 rounded-lg">
                                                    Edit
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
            <Footer/>
        </div>

    );
}
