
import {
    CheckCircle,
    Award,
    Home,
    Star,
    Gift,
    BookCheck,
    Gavel,
    ClipboardCheck,
    MapPin,
    Phone,
    Users,
    Search,
    Calendar,
    TrendingUp,
} from "lucide-react";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import NavigationShell from "../../navigation/mainNav";


// household information
const household = {
    id: "HH-24680135",
    name: "Dela Cruz Family",
    address: "123 Green Street, Barangay Sunshine, Metro City",
    contact: "+63 917 123 4567",
    members: 5,
    registeredSince: "January 15, 2026",
    totalDisposals: 48,
    compliance: "Excellent",
    points: {
        total: 1240,
        thisMonth: 280,
    },
};

// waste stats
const wasteStats = [
    {
        type: "Biodegradable",
        count: 28,
        points: 560,
        percent: 58,
        color: "green",
    },
    {
        type: "Non-biodegradable",
        count: 12,
        points: 240,
        percent: 25,
        color: "orange",
    },
    {
        type: "Recyclable",
        count: 8,
        points: 440,
        percent: 17,
        color: "blue",
    },
];

// for household information to
const infoItems = [
    {
        label: "Household Name",
        value: household.name,
        icon: Home,
    },
    {
        label: "Address",
        value: household.address,
        icon: MapPin,
    },
    {
        label: "Contact Number",
        value: household.contact,
        icon: Phone,
    },
    {
        label: "Members",
        value: `${household.members} people`,
        icon: Users,
    },
    {
        label: "Registered Since",
        value: household.registeredSince,
        icon: Calendar,
    },
    {
        label: "Total Disposals",
        value: `${household.totalDisposals} times`,
        icon: TrendingUp,
    },
];


import pandisplay from "../../resources/pandisplay.jpg"
import plasticBrick from "../../resources/plastic-brick.jpg"
import recyc1 from "../../resources/recyc1.jpg"
import tenStreak from "../../resources/tenStreak.png"
import oneMonth from "../../resources/oneMonth.jpg"
import RulesModal from "../../components/RulesModal";

const RULES = [
    {
        image: recyc1,
        id: 1,
        name: "Recyclable Materials",
        decs: "Earn points by recycling normal materials such as plastic, paper, glass, and metal",
        points: 15,
        freq: "per kilo"
    },
    {
        image: tenStreak,
        id: 2,
        name: "10-Day Consistency Streak",
        decs: "Maintain proper bin usage without any violation for 10 consecutive days",
        points: 30,
        freq: "per streak"
    },
    {
        image: plasticBrick,
        id: 3,
        name: "Plastic Bottle Bricks",
        decs: "Create eco-bricks by filling plastic bottles with non-recyclable plastic waste to be used for construction",
        points: 50,
        freq: "per brick"
    },
    {
        image: oneMonth,
        id: 4,
        name: "1 month Consistency Streak",
        decs: "Maintain proper bin usage without any violation for 1 month",
        points: 100,
        freq: "per streak"
    },
    {
        image: pandisplay,
        id: 5,
        name: "Recycled Items or Accessories",
        decs: "Already recycled items transformed into display pieces or accessories. Points vary based on design creativity and quality",
        points: "50-200",
        freq: "per item"
    },
];
export default function QRhandler() {

    const [search, setSearch] = useState("")


    return (

        <div className="flex-1">
            <Navbar />
            <div className="flex min-h-screen bg-gray-50">
                <NavigationShell />

                <main className="w-full flex flex-col gap-4 pb-20 px-4 sm:p-6">
                    {/* Page Header */}
                    <h1 className="text-2xl font-bold mb-1">QR code</h1>
                    <p className="text-gray-500 mb-6">
                        QR Code Verification for Households
                    </p>

                    <section>
                        {/* Top Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* QR Code */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="font-semibold mb-4 text-center">
                                    Household QR Code
                                </h3>
                                <div className="flex justify-center mb-4">
                                    <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                                        QR CODE
                                    </div>
                                </div>
                                <p className="text-center text-sm text-gray-500">
                                    Household ID
                                </p>
                                <p className="text-center font-semibold text-green-600">
                                    {household.id}
                                </p>
                            </div>

                            {/* Compliance */}
                            <div className="bg-green-50 border border-green-200 rounded-xl shadow p-6">
                                <div className="flex items-center gap-2 text-green-600 mb-4">
                                    <CheckCircle size={20} />
                                    <h3 className="font-semibold">Compliance Status</h3>
                                </div>
                                <h2 className="text-3xl font-bold text-green-700 mb-2">
                                    {household.compliance}
                                </h2>
                                <p className="text-green-600 mb-6">
                                    Keep up the great work!
                                </p>
                                <p className="text-xs text-gray-500">
                                    Based on Republic Act No. 9003
                                </p>
                            </div>

                        </div>
                    </section>

                    <section className="bg-white rounded-xl p-6 shadow">

                        <div className="flex flex-col lg:flex-row justify-between py-4">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <ClipboardCheck className="text-green-600" />
                                Rules for Gamified
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">


                                <div className="relative">
                                    <Search className="absolute left-3 top-5 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search reward"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {RULES.map((r) => (
                                <div
                                    key={r.id}
                                    className="relative bg-gray-50 rounded-xl flex flex-col shadow-lg"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={r.image}
                                            alt={r.name}
                                            className="w-full h-90 object-cover transform transition-transform rounded-tr-lg rounded-tl-lg duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex flex-col p-4 gap-2">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-bold"><span>Rule {r.id}</span> - {r.name}</h1>
                                            <p className="text-sm text-gray-400 font-semibold text-center px-4 py-1 rounded-full">
                                                -{r.freq}
                                            </p>
                                        </div>
                                        <p className="text-gray-500">
                                            {r.decs}
                                        </p>
                                    </div>

                                    <div className="bg-white absolute top-2 right-2 rounded-lg p-2 shadow-md">
                                        <h2 className="flex flex-col text-center text-green-500 font-bold text-xl">
                                            +{r.points}
                                            <span className="text-gray-500 text-sm font-semibold">points</span>
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                </main>
            </div>
        </div>
    );
}
