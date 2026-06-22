import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import NavigationShell from "../../navigation/mainNav";
import Footer from "../../components/Footer";
import AddHousehold from "../../components/AddHouseholdModal";

import {
    Trash2,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Bell,
    Star,
    MapPin,
    MailPlus,
    Search,
    Plus,
    TrendingUp,
    Filter,
    Home
} from "lucide-react";
import HouseholdRecordModal from "../../components/HHrecordModal";
import ConfirmationModal from "../../components/confirmationModal";
import AssignRFIDModal from "../../components/AssignRFID";

const householdRequest = [
    {
        id: 1,
        name: "Jay Robles",
        address: "Rizal St.",
        email: "jayrobles100@gmail.com",
        contact: "091234567890",
    },
    {
        id: 2,
        name: "Amado Crisostomo",
        address: "Mabini St",
        email: "crisostomomado@gmail.com",
        contact: "09987654321",
    },
];

export default function HouseholdInfo() {
    const [active, setActive] = useState(false);
    const [activeTab, setActiveTab] = useState("household");
    const [openHHModal, setOpenHHModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openRFIDmodal, setopenRFIDmodal] = useState(false);
    const [activeHousehold, setactiveHousehold] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // ── DB state ──────────────────────────────────────
    const [householdRecords, setHouseholdRecords] = useState([]);
    const [loadingHouseholds, setLoadingHouseholds] = useState(true);
    const [fetchError, setFetchError] = useState("");

    // ── Fetch households from backend ─────────────────
    const fetchHouseholds = async () => {
        setLoadingHouseholds(true);
        setFetchError("");
        try {
            const res = await fetch(
                `http://localhost:5000/api/households?search=${search}&limit=100`
            );
            const data = await res.json();
            if (data.success) {
                setHouseholdRecords(data.data);
            } else {
                setFetchError("Failed to load households.");
            }
        } catch (err) {
            setFetchError("Cannot connect to server. Make sure the backend is running.");
        } finally {
            setLoadingHouseholds(false);
        }
    };

    // Fetch on mount and when search changes
    useEffect(() => {
        fetchHouseholds();
    }, [search]);

    // Refetch after adding a new household
    const handleAddModalClose = () => {
        setOpenAddModal(false);
        fetchHouseholds(); // refresh table
    };

    const handleConfirm = () => {
        setActive(false);
        setopenRFIDmodal(true);
    };

    const filteredData = householdRecords.filter((h) => {
        const matchSearch =
            h.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            h._id?.toLowerCase().includes(search.toLowerCase()) ||
            h.rfid?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    return (
        <div className="flex-1">
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
                <div className="flex gap-4">
                    <NavigationShell />
                    <div className="py-2 md:hidden">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Household Information Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg">
                            Manage household Information of the community
                        </p>
                    </div>
                </div>

                <main className="w-full p-4 sm:p-6 space-y-6">

                    <div className="hidden md:block">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Household Information Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg">
                            Manage household Information of the community
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="w-full flex overflow-x-auto bg-gray-100 rounded-full justify-center md:w-fit justify-evenly text-[#4A3B47] mb-6 p-1 space-x-2">
                        {[
                            { id: "household", label: "Household Information", icon: <Home size={15} /> },
                            { id: "request", label: "Registeration Request", icon: <MailPlus size={15} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center md:justify-between cursor-pointer gap-2 px-4 py-1 whitespace-nowrap transition ${
                                    activeTab === tab.id
                                        ? "bg-white rounded-full text-gray-800 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-200 rounded-full"
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* HOUSEHOLD INFORMATION */}
                    {activeTab === "household" && (
                        <section className="w-full bg-white rounded-2xl shadow p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                    Household Records
                                </h2>

                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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

                                    <div className="relative">
                                        <button
                                            title="Register household"
                                            onClick={() => setOpenAddModal(true)}
                                            className="bg-green-600 text-white w-full flex p-2 rounded-lg cursor-pointer md:w-10 h-10 hover:bg-green-700"
                                        >
                                            <Plus />
                                            <p className="block md:hidden">Register Household</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Loading / Error states */}
                            {loadingHouseholds && (
                                <p className="text-center text-gray-400 py-8">Loading households...</p>
                            )}
                            {fetchError && (
                                <p className="text-center text-red-500 py-8">{fetchError}</p>
                            )}

                            {/* Table */}
                            {!loadingHouseholds && !fetchError && (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px]">
                                        <thead className="bg-gray-50 text-center">
                                            <tr>
                                                <th className="px-4 py-3 text-sm font-semibold">Household ID</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Address</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Contact</th>
                                                <th className="px-4 py-3 text-sm font-semibold">RFID</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-8 text-gray-400">
                                                        No households found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredData.map((item) => (
                                                    <tr key={item._id} className="hover:bg-gray-50 text-center">
                                                        <td className="px-4 py-3 font-mono text-sm">
                                                            {item._id.slice(-8).toUpperCase()}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium">{item.fullname}</td>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            {[item.address?.houseNo, item.address?.street]
                                                                .filter(Boolean)
                                                                .join(", ") || "—"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            +63 {item.contactNumber}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-sm text-gray-600">
                                                            {item.rfid || "—"}
                                                        </td>
                                                        <td className="flex flex-row gap-2 justify-center py-3">
                                                            <button
                                                                onClick={() => setactiveHousehold(item._id)}
                                                                className="cursor-pointer bg-gray-900 text-white px-3 py-1 rounded-lg"
                                                            >
                                                                View
                                                            </button>

                                                            <HouseholdRecordModal
                                                                isOpen={activeHousehold === item._id}
                                                                onClose={() => setactiveHousehold(null)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}

                    {/* REQUEST TAB */}
                    {activeTab === "request" && (
                        <section className="w-full bg-white rounded-2xl shadow p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                    Household Registeration Request
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 text-center">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Address</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Email</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Contact</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {householdRequest.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 text-center">
                                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.address}</td>
                                                <td className="px-4 py-3">{item.email}</td>
                                                <td className="px-4 py-3">{item.contact}</td>
                                                <td className="flex flex-row justify-center items-center gap-2 py-3">
                                                    <button
                                                        onClick={() => setActive(true)}
                                                        className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        Approved
                                                    </button>
                                                    <button className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded-lg">
                                                        Decline
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                </main>

                <ConfirmationModal
                    isOpen={active}
                    onClose={() => setActive(false)}
                    onConfirm={handleConfirm}
                />

                <AddHousehold
                    isOpen={openAddModal}
                    onClose={handleAddModalClose}
                />

                <AssignRFIDModal
                    isOpen={openRFIDmodal}
                    onClose={() => setopenRFIDmodal(false)}
                />
            </div>
            <Footer />
        </div>
    );
}