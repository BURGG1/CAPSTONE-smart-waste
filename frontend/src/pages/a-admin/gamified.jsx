import Navbar from "../../components/Navbar";
import { Star, TrendingUp, Gift } from "lucide-react";
import NavigationShell from "../../navigation/mainNav";
import Footer from "../../components/Footer";


import { Plus, Camera, Asterisk, Search } from "lucide-react";
import { useState } from "react";
import { ViewRewardModal } from "../../components/RewardModal";
import ConfirmationModal from "../../components/confirmationModal";


// Points summary
const POINTS = {
    total: 1234,
    tier: "Silver",
    maxTierPoints: 1500,
    remaining: 260,
};

// Monthly stats
const MONTHLY = {
    earned: 280,
    redeemed: 200,
    net: 80,
};

// Redeemable items
const REWARDS = [
    { id: 1, name: "Free Clinical Checkup", points: 200, stocks: 15 },
    { id: 2, name: "50% off to Barangay indigency", points: 350, stocks: 8 },
    { id: 3, name: "Plant Seedlings", points: 150, stocks: 20 },
    { id: 4, name: "Compost Bin", points: 500, stocks: 5 },
];

// Derived values
const progressPercent = Math.round(
    (POINTS.total / POINTS.maxTierPoints) * 100
);

// Penalty Data
const penaltiesData = {
    note:
        "Repeated violations may result in additional penalties and suspension of waste disposal privileges.",
    records: [
        {
            reason:
                "Improper waste segregation (mixed biodegradable with non-biodegradable)",
            date: "2026-01-15",
            points: -500,
            law: "RA 9003 Section 48",
        },
    ],
};

// recentActivityData
const recentActivityData = [
    {
        type: "Earned points",
        date: "2026-01-24",
        points: 20,
    },
    {
        type: "Redeemed Eco Bag",
        date: "2026-01-23",
        points: -200,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },
    {
        type: "Earned points",
        date: "2026-01-22",
        points: 55,
    },

];



export default function Gamified() {
    const [openConModal, setOpenConModal] = useState(false)

    const [Name, setName] = useState("")
    const [Points, setPoints] = useState("")
    const [Stocks, setStocks] = useState("")

    const [ToEdit, setToEdit] = useState(false)
    const [openRewardModal, setOpenRewardModal] = useState(false)

    const [search, setSearch] = useState("");

    const handleRewardEdit = (id) => {
        const item = REWARDS.find((reward) => reward.id === id);
        if (!item) return;

        setName(item.name);
        setPoints(item.points);
        setStocks(item.stocks);
    };



    const ClearRewardEdit = () => {
        setName("");
        setPoints("");
        setStocks("");
    };


    const filteredData = REWARDS.filter((h) => {
        const matchSearch =
            h.name.toLowerCase().includes(search.toLowerCase())

        return matchSearch;
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
                            Gamified Rewards Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
                            Process reward and pointing system
                        </p>
                    </div>
                </div>

                <main className="w-full p-4 sm:p-6 space-y-6">

                    <div className="hidden md:block">
                        <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                            Gamified Rewards Management
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-lg ">
                            Process reward and pointing system
                        </p>
                    </div>

                    <section className="bg-white rounded-xl p-6 shadow">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Plus className="text-green-600" />
                            {ToEdit ? ("Update item") : ("Add New Items")}
                        </h2>

                        {/* Image Upload */}
                        <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
                            <label className="flex items-center gap-2 cursor-pointer text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700 transition">
                                <Camera size={16} />
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" />
                            </label>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">


                            <div className="flex items-center">
                                <Asterisk className="text-red-500 w-4 h-4" />
                                <input
                                    value={Name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 text-black rounded-lg border"
                                    placeholder="Name"
                                />
                            </div>

                            <div className="flex items-center">

                                <Asterisk className="text-red-500 w-4 h-4" />
                                <input
                                    value={Points}
                                    onChange={(e) => setPoints(e.target.value)}
                                    className="w-full px-3 py-2 text-black rounded-lg border"
                                    placeholder="Points"
                                    type="number"
                                    step="0.01"
                                />

                            </div>

                            <div className="flex items-center">

                                <Asterisk className="text-red-500 w-4 h-4" />
                                <input
                                    value={Stocks}
                                    onChange={(e) => setStocks(e.target.value)}
                                    className="w-full px-3 py-2 text-black rounded-lg border"
                                    placeholder="Stock"
                                    type="number"
                                />

                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="mt-3 flex justify-end gap-2">
                            {ToEdit ? (
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => setOpenConModal(true)}
                                        className="cursor-pointer mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                        Update Item
                                    </button>

                                    <button
                                        onClick={() => {
                                            setToEdit(false);
                                            ClearRewardEdit();
                                        }}
                                        className="cursor-pointer mt-auto bg-gray-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-gray-700 transition">
                                        Cancel
                                    </button>

                                </div>) : (
                                <button className="cursor-pointer mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                    <Plus size={16} />
                                    Add New Item
                                </button>
                            )}

                        </div>
                    </section>

                    {/* Redeemable Items */}
                    <section className="bg-white rounded-xl p-6 shadow">

                        <div className="flex justify-between">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <Gift className="text-green-600" />
                                Redeemable Rewards
                            </h2>

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {REWARDS.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 rounded-xl p-4 flex flex-col"
                                >
                                    <div className="h-24 bg-gray-200 rounded mb-4 flex items-center justify-center">
                                        ICON
                                    </div>

                                    <h3 className="font-semibold">{item.name}</h3>

                                    <div className="flex justify-between text-sm my-2">
                                        <span className="text-green-600 font-semibold">
                                            {item.points} pts
                                        </span>
                                        <span className="text-gray-500">
                                            {item.stocks} left
                                        </span>
                                    </div>

                                    <div className="w-full flex items-center gap-2">


                                        <div className="flex-1">
                                            <button
                                                onClick={() => setOpenRewardModal(true)}
                                                className="w-full cursor-pointer mt-auto bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
                                                View
                                            </button>
                                        </div>

                                        <div className="flex-1 relative">

                                            <button
                                                onClick={() => {
                                                    setToEdit(true);
                                                    handleRewardEdit(item.id)
                                                }}
                                                className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg"
                                            >
                                                Edit
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <ViewRewardModal
                    isOpen={openRewardModal}
                    onClose={() => setOpenRewardModal(false)}
                />

                <ConfirmationModal
                    isOpen={openConModal}
                    onClose={() => {
                        setToEdit(false);
                        setOpenConModal(false);
                        ClearRewardEdit();
                    }}
                />

            </div>
            <Footer />
        </div >
    );

}
