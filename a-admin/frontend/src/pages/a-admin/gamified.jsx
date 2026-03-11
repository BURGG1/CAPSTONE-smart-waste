import Navbar from "../../components/Navbar";
import {
    Star,
    TrendingUp,
    Gift,
    BookCheck,
    Gavel,
    ClipboardCheck,
    Clipboard

} from "lucide-react";
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
    { id: 1, name: "Free Clinical Checkup", points: 1200, stocks: 15 },
    { id: 2, name: "50% off to Barangay Clearance", points: 1200, stocks: 8 },
    { id: 3, name: "Vitamins/Medicine", points: 500, stocks: 20 },
    { id: 4, name: "50% off to Business Permit", points: 1500, stocks: 5 },

];

// Recent Activity
const rewardLogs = [
    {
        id: 1,
        date: "2026-02-18",
        rewardName: "Free Clinical Checkup",
        householdId: "HH-202610001",
        householdName: "Joel Dela Cruz",
        stockUpdate: -1,
    },
    {
        id: 2,
        date: "2026-02-18",
        rewardName: "Vitamins/Medicine",
        householdId: "HH-202610002",
        householdName: "Martin Lopez",
        stockUpdate: -1,
    },
    {
        id: 3,
        date: "2026-02-17",
        rewardName: "Free Clinical Checkup",
        householdId: "HH-202610003",
        householdName: "Ramon Reyes",
        stockUpdate: -1,
    },
    {
        id: 4,
        date: "2026-02-16",
        rewardName: "50% off to Barangay Clearance",
        householdId: "HH-202610004",
        householdName: "Remedio Delo Santos",
        stockUpdate: -1,
    },
    {
        id: 5,
        date: "2026-02-15",
        rewardName: "50% off to Business Permit",
        householdId: "HH-202610005",
        householdName: "Cecilia Garcia",
        stockUpdate: -1,
    },
    {
        id: 6,
        date: "2026-02-14",
        rewardName: "50% off to Business Permit",
        householdId: "HH-202610006",
        householdName: "Rolando Martinez",
        stockUpdate: -1,
    },
    {
        id: 7,
        date: "2026-02-13",
        rewardName: "50% off to Barangay Clearance",
        householdId: "HH-202610007",
        householdName: "Rolando Martinez",
        stockUpdate: -1,
    },
    {
        id: 8,
        date: "2026-02-12",
        rewardName: "Vitamins/Medicine",
        householdId: "HH-202610008",
        householdName: "Joel Dela Cruz",
        stockUpdate: -1,
    },
];


import pandisplay from "../../resources/pandisplay.jpg"
import plasticBrick from "../../resources/plastic-brick.jpg"
import recyc1 from "../../resources/recyc1.jpg"
import tenStreak from "../../resources/tenStreak.png"
import oneMonth from "../../resources/oneMonth.jpg"
import RulesModal from "../../components/RulesModal";
import AwardModal from "../../components/AwardModal";

const RULES = [
    {
        image: recyc1,
        id: 1,
        name: "Recyclable Materials",
        decs: "Earn points by returning recyclable materials such as plastic, paper, glass, and metal",
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
// Derived values
const progressPercent = Math.round(
    (POINTS.total / POINTS.maxTierPoints) * 100
);


export default function Gamified() {
    const [activeTab, setActiveTab] = useState("rewards")
    const [openConModal, setOpenConModal] = useState(false)
    const [openRulesModal, setOpenRulesModal] = useState(false)
    const [openAwardModal, setopenAwardModal] = useState(false)

    const [clickedReward, setClickReward] = useState(null);
    const [clickedRule, setClickRule] = useState(null);

    // for reward-----------
    const [Name, setName] = useState("")
    const [Points, setPoints] = useState("")
    const [Stocks, setStocks] = useState("")

    const [ToEdit, setToEdit] = useState(false)
    const [openRewardModal, setOpenRewardModal] = useState(false)

    const [search, setSearch] = useState("")

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

                    {/* Tabs */}
                    <div className="w-full flex overflow-x-auto bg-gray-100 rounded-full justify-center md:w-fit justify-evenly text-[#4A3B47] mb-6 p-1 space-x-2">
                        {[
                            { id: "rewards", label: "Reward", icon: <Star size={15} /> },
                            { id: "rules", label: "Rules", icon: <BookCheck size={15} /> },

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
                    {/* REWAAAAARRDDDDDDDDDDDSSSSSSSSSSSS */}
                    {activeTab == "rewards" && (
                        <>
                            <section className="bg-white rounded-xl p-6 shadow">
                                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                    <Plus className="text-green-600" />
                                    {ToEdit ? ("Update Reward") : ("Add New Reward")}
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
                                                Update Reward
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
                                            Add New Reward
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

                                <div className="h-[250px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 rounded-xl p-4 flex flex-col shadow-lg"
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
                                                        onClick={() => {
                                                            setOpenRewardModal(true);
                                                            setClickReward(item.name);
                                                        }}
                                                        className="w-full cursor-pointer mt-auto bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-700 transition">
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

                            {/* RECENT ACTIVITIES */}
                            <section className="bg-white rounded-xl p-6 shadow">
                                <h2 className="text-lg font-bold">Recent Reward Logs</h2>

                                {/* TABLE */}
                                <div className="max-h-[350px] overflow-y-auto overflow-x-auto mt-4">
                                    <table className="w-full  text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3">Date</th>
                                                <th>Reward Name</th>
                                                <th>Household ID</th>
                                                <th>Resident</th>
                                                <th className="px-4">Stock</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-center">
                                            {rewardLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="py-3 font-medium">{log.date}</td>

                                                    <td>
                                                        {log.rewardName}
                                                    </td>
                                                    <td>{log.householdId}</td>

                                                    <td>{log.householdName}</td>

                                                    <td className="text-red-500">{log.stockUpdate}</td>
                                                </tr>
                                            ))}

                                            {rewardLogs.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                                        No records found for selected dates
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    )}

                    {/* RULEEEEESSSSSSSSSSSSSSSSSSSSSSSSSS */}
                    {activeTab == "rules" && (
                        <>
                            {/* RULES*/}
                            <section className="bg-white rounded-xl p-6 shadow">

                                <div className="flex flex-col lg:flex-row justify-between py-4">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <ClipboardCheck className="text-green-600" />
                                        How to Earn Points
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

                                        <div className="relative">
                                            <button
                                                title="Register household"
                                                onClick={() => setOpenRulesModal(true)}
                                                className="bg-green-600 text-white w-full flex p-2 rounded-lg cursor-pointer hover:bg-green-700"
                                            >
                                                <Plus />
                                                <p>Add new rule</p>
                                            </button>
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
                                                        {r.freq}
                                                    </p>
                                                </div>
                                                <p className="text-gray-500">
                                                    {r.decs}
                                                </p>
                                                <div className="w-full flex items-center gap-2 mt-4">

                                                    <div className="flex-1">
                                                        <button
                                                            onClick={() => {
                                                                setClickRule(r);
                                                                setopenAwardModal(true);
                                                            }}
                                                            className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg"
                                                        >
                                                            Award
                                                        </button>

                                                    </div>
                                                    <div className="flex-1">
                                                        <button
                                                            onClick={() => {
                                                                setToEdit(true);
                                                                setOpenRulesModal(true);
                                                            }}
                                                            className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg"
                                                        >
                                                            Edit
                                                        </button>

                                                    </div>
                                                </div>
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
                        </>

                    )}



                </main>

                <ViewRewardModal
                    isOpen={openRewardModal}
                    onClose={() => setOpenRewardModal(false)}
                    rName={clickedReward}
                />

                <RulesModal
                    isOpen={openRulesModal}
                    onClose={() => setOpenRulesModal(false)}
                    edit={ToEdit}
                />

                <ConfirmationModal
                    isOpen={openConModal}
                    onClose={() => {
                        setToEdit(false);
                        setOpenConModal(false);
                        ClearRewardEdit();
                    }}
                    onConfirm={() => {
                        setOpenConModal(false);
                        onClose();
                    }}
                />

                <AwardModal
                    isOpen={openAwardModal}
                    onClose={() =>{setopenAwardModal(false)}}
                    rule={clickedRule}
                />

            </div>
            <Footer />
        </div >
    );

}
