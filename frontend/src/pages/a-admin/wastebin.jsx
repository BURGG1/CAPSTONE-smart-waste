import { useState, useRef, useEffect } from "react";
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
    Asterisk,
    Plus,
    TrendingUp,
    Filter
} from "lucide-react";

import ConfirmationModal from "../../components/confirmationModal";

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

const bins = [
    {
        id: "BIN-001",
        location: "Rizal St.",
        type: "Biodegradable",
        personel: "Jeffry Agustin",
        lastEmptied: "2026-01-23 08:00 AM",
    },
    {
        id: "BIN-002",
        location: "Mabini St.",
        type: "Biodegradable",
        personel: "Queenie Legaspi",
        lastEmptied: "2026-01-24 10:30 AM",
    },
    {
        id: "BIN-003",
        location: "Luna St.",
        type: "Biodegradable",
        personel: "Masaki Saito",
        lastEmptied: "2026-01-22 02:00 PM",
    },
    {
        id: "BIN-004",
        location: "Rizal St.",
        type: "Non-biodegradable",
        personel: "Jeffry Agustin",
        lastEmptied: "2026-01-23 08:00 AM",
    },
    {
        id: "BIN-005",
        location: "Mabini St.",
        type: "Non-biodegradable",
        personel: "Queenie Legaspi",
        lastEmptied: "2026-01-24 10:30 AM",
    },
    {
        id: "BIN-006",
        location: "Luna St.",
        type: "Non-biodegradable",
        personel: "Masaki Saito",
        lastEmptied: "2026-01-22 02:00 PM",
    },
];


function getStatusFromFill(fill) {
    if (fill >= 90) return "critical";
    if (fill >= 61) return "warning";
    return "good";
}

export default function WasteBin() {

    const [openConModal, setOpenConModal] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [openPointsModal, setOpenPointsModal] = useState(false)

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [capacity, setCapacity] = useState("");

    const filteredData = BinInformation.filter((h) => {
        const matchSearch =
            h.category.toLowerCase().includes(search.toLowerCase()) ||
            h.id.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "all" || h.category === filter;

        return matchSearch && matchFilter;
    });

    // temporary ----------------------------------------------------------------------------------
    const inputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editedLocation, setEditedLocation] = useState("");

    const handleSave = (id) => {
        setBins((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, location: editedLocation }
                    : item
            )
        );

        setEditingId(null);
    };

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);


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

                            <div className="flex items-center">
                                {/* category */}
                                <Asterisk className="text-red-500 w-4 h-4" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Bin Type:</option>
                                    <option value="Biodegradable">Biodegradable</option>
                                    <option value="NonBiodegradable">Non-Biodegradable</option>

                                </select>

                            </div>

                            <div className="flex items-center">
                                {/* capacity */}
                                <Asterisk className="text-red-500 w-4 h-4" />
                                <select
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="w-full py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Capacity</option>
                                    <option value="100">100L</option>
                                    <option value="500">500L</option>
                                </select>

                            </div>

                            <div className="flex items-center">

                                {/* location */}
                                <Asterisk className="text-red-500 w-4 h-4" />
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">Bin Location</option>
                                    <option value="compliant">Rizal St.</option>
                                    <option value="warning">Mabini St.</option>
                                    <option value="non-compliant">Bonifacio St.</option>
                                </select>
                            </div>

                        </div>
                        {/* Buttons */}
                        <div className="mt-3 flex justify-end  gap-2">

                            <button
                                onClick={() => setOpenConModal(true)}
                                className="cursor-pointer px-5 mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                <Plus size={16} />
                                Add Bin
                            </button>
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
                                        placeholder="Search Bin ID..."
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
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.capacity}<span>L</span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <input
                                                    className="outline-none pl-2"
                                                    type="text"
                                                    ref={editingId === item.id ? inputRef : null}
                                                    value={editingId === item.id ? editedLocation : item.location}
                                                    disabled={editingId !== item.id}
                                                    onChange={(e) => setEditedLocation(e.target.value)}

                                                />
                                            </td>

                                            <td className="flex flex-row gap-2">
                                                {isEditing == true && editingId === item.id ? (
                                                    <button
                                                        className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-lg"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setOpenConModal(true);
                                                            handleSave(item.id);
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded-lg"
                                                        onClick={() => {
                                                            setIsEditing(true);
                                                            setEditingId(item.id);
                                                            setEditedLocation(item.location);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-white rounded-xl p-6 shadow">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            Counter Information
                        </h2>
                        {/* BIN CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
                            {bins.map((bin) => {
                                const status = getStatusFromFill(bin.fill);
                                const style = statusColors[status];
                                const StatusIcon = style.icon;

                                return (
                                    <div
                                        key={bin.id}
                                        className={`bg-white rounded-xl border p-6 shadow-md`}
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

                                        <div className="mt-4 text-sm space-y-1">
                                            <p>Last Collected: <strong>{bin.lastEmptied}</strong></p>
                                        </div>

                                        <button
                                            onClick={() => setOpenPointsModal(true)}
                                            className="w-full mt-4 bg-green-600 cursor-pointer text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">

                                            View
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </main>
            </div>
            <ConfirmationModal
                isOpen={openConModal}
                onClose={() => {
                    setOpenConModal(false);
                }}
            />

            <AssignPointsModal
                isOpen={openPointsModal}
                onClose={() => setOpenPointsModal(false)}
            />

            <Footer />
        </div>

    );
}
