import { useState } from "react";
import Navbar from "../../components/Navbar";
import AssignPointsModal from "../../components/CounterInfoModal";
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

const householdRecords = [
    {
        id: "HH-202610001",
        name: "Joey Dela Cruz",
        address: "Rizal St.",
        disposals: 48,
        points: 1240,
    },
    {
        id: "HH-202610002",
        name: "Remedios Delo Santos",
        address: "Rizal St",
        disposals: 35,
        points: 920,
    },
    {
        id: "HH-202610003",
        name: "Ramon Reyes",
        address: "Mabini St",
        disposals: 22,
        points: 450,
    },
    {
        id: "HH-202610004",
        name: "Cecilia Garcia",
        address: "Mabini St",
        disposals: 12,
        points: 180,
    },
    {
        id: "HH-202610005",
        name: "Rolando Martinez",
        address: "Mabini St",
        disposals: 41,
        points: 1050,
    },
    {
        id: "HH-202610006",
        name: "Martin Lopez",
        address: "Bonifacio St",
        disposals: 18,
        points: 380,
    },

];

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

export default function HouseholdInfo() {


    const [activeTab, setActiveTab] = useState("household")

    const [openHHModal, setOpenHHModal] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [activeHousehold, setactiveHousehold] = useState(null)


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
            <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
                <div className="flex gap-4">
                    {/* FOR MOBILE */}
                    <NavigationShell />
                    <div className="py-2 md:hidden">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Household Information Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
                            Manage household Information of the community
                        </p>
                    </div>

                </div>

                <main className="w-full p-4 sm:p-6 space-y-6">

                    <div className="hidden md:block">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Household Information Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
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
                                className={`flex items-center justify-center md:justify-between cursor-pointer gap-2 px-4 py-1 whitespace-nowrap transition ${activeTab === tab.id
                                    ? "bg-white rounded-full text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-200 rounded-full"
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>


                    {/* HOUSEHOLDDD INFORMATIONNNNNNNNNNNNNN */}

                    {activeTab == "household" && (

                        <section className="w-full bg-white rounded-2xl shadow p-6">
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

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 text-center">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold">Household ID</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Address</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Disposals</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Points</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 text-center">
                                                <td className="px-4 py-3 font-mono text-sm">{item.id}</td>
                                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.address}</td>
                                                <td className="px-8 py-3">{item.disposals}</td>
                                                <td className="px-4 py-3 font-bold text-green-600">
                                                    {item.points}
                                                </td>
                                                <td className="flex flex-row gap-2 justify-center">
                                                    <button
                                                        onClick={() => setactiveHousehold(item.id)}
                                                        className="cursor-pointer bg-gray-900 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        View
                                                    </button>

                                                    <HouseholdRecordModal
                                                        isOpen={activeHousehold === item.id}
                                                        onClose={() => setactiveHousehold(null)}
                                                    />
                                                    {/* <button className="bg-blue-300 px-3 py-1 rounded-lg">
                                                    View
                                                </button>
                                                <button className="bg-green-400 px-3 py-1 rounded-lg">
                                                    Edit
                                                </button> */}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    )}

                    {/* REQUEEESSTTTTTTTTTTTTT */}
                    {activeTab == "request" && (

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
                                                <td className="px-4 py-3">
                                                    {item.contact}
                                                </td>
                                                <td className="flex flex-row justify-center items-center gap-2">
                                                    {/* <button
                                                        onClick={() => setactiveHousehold(item.id)}
                                                        className="cursor-pointer bg-gray-900 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        View
                                                    </button>

                                                    <HouseholdRecordModal
                                                        isOpen={activeHousehold === item.id}
                                                        onClose={() => setactiveHousehold(null)}
                                                    /> */}

                                                    <button
                                                        
                                                        className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        Approved
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


                <AddHousehold
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                />
            </div>
            <Footer />
        </div>

    );
}
