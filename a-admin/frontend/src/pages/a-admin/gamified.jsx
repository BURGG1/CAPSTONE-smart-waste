import { useState, useEffect } from "react";
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
import { ViewRewardModal } from "../../components/RewardModal";
import ConfirmationModal from "../../components/confirmationModal";
import RulesModal from "../../components/RulesModal";
import AwardModal from "../../components/AwardModal";
import ClaimReward from "../../components/ClaimReward";

import { getRewards, createReward, updateReward } from "../../api/rewardApi";
import { getRules } from "../../api/rulesAPI";

// Your backend's base URL — used to build full image URLs since the DB only stores a path like "/uploads/x.jpg"
const IMAGE_BASE = "http://localhost:5000";

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

// Recent Activity — still static, there's no reward-log API yet.
// Ask if you want this wired to a real collection too.
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

// Derived values
const progressPercent = Math.round(
    (POINTS.total / POINTS.maxTierPoints) * 100
);

export default function Gamified() {
    const [activeTab, setActiveTab] = useState("rewards");
    const [openConModal, setOpenConModal] = useState(false);
    const [openRulesModal, setOpenRulesModal] = useState(false);
    const [openAwardModal, setopenAwardModal] = useState(false);
    const [openClaimModal, setopenClaimModal] = useState(false);

    const [clickedReward, setClickReward] = useState(null);
    const [pointNeed, setPointNeed] = useState();
    const [clickedRule, setClickRule] = useState(null);

    // ---- Rewards now come from the database ----
    const [rewards, setRewards] = useState([]);
    const [rewardsLoading, setRewardsLoading] = useState(true);
    const [rewardsError, setRewardsError] = useState("");
    const [editingRewardId, setEditingRewardId] = useState(null);

    // ---- Rules now come from the database ----
    const [rules, setRules] = useState([]);
    const [rulesLoading, setRulesLoading] = useState(true);
    const [rulesError, setRulesError] = useState("");
    const [editRuleData, setEditRuleData] = useState(null); // which rule is being edited

    // for reward form -----------
    const [Name, setName] = useState("");
    const [Points, setPoints] = useState("");
    const [Stocks, setStocks] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [ToEdit, setToEdit] = useState(false);
    const [openRewardModal, setOpenRewardModal] = useState(false);

    const [search, setSearch] = useState("");

    const fetchRewards = async () => {
        try {
            setRewardsLoading(true);
            const data = await getRewards();
            setRewards(data);
            setRewardsError("");
        } catch (err) {
            console.error(err);
            setRewardsError("Failed to load rewards. Is the server running?");
        } finally {
            setRewardsLoading(false);
        }
    };

    const fetchRules = async () => {
        try {
            setRulesLoading(true);
            const data = await getRules();
            setRules(data);
            setRulesError("");
        } catch (err) {
            console.error(err);
            setRulesError("Failed to load rules. Is the server running?");
        } finally {
            setRulesLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
        fetchRules();
    }, []);

    const handleRewardEdit = (id) => {
        const item = rewards.find((reward) => reward._id === id);
        if (!item) return;

        setEditingRewardId(item._id);
        setName(item.name);
        setPoints(item.points);
        setStocks(item.stocks);
    };

    const ClearRewardEdit = () => {
        setName("");
        setPoints("");
        setStocks("");
        setImageFile(null);
        setEditingRewardId(null);
    };

    const handleAddReward = async () => {
        if (!Name || !Points || !Stocks) {
            alert("Name, points, and stock are required");
            return;
        }
        try {
            await createReward({ name: Name, points: Points, stocks: Stocks, imageFile });
            await fetchRewards();
            ClearRewardEdit();
        } catch (err) {
            console.error(err);
            alert("Failed to add reward");
        }
    };

    const handleUpdateReward = async () => {
        try {
            await updateReward(editingRewardId, {
                name: Name,
                points: Points,
                stocks: Stocks,
                imageFile,
            });
            await fetchRewards();
            setToEdit(false);
            setOpenConModal(false);
            ClearRewardEdit();
        } catch (err) {
            console.error(err);
            alert("Failed to update reward");
        }
    };

    const filteredData = rewards.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredRules = rules.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

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

                    {/* REWARDS TAB */}
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
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setImageFile(e.target.files[0] || null)}
                                        />
                                    </label>
                                    {imageFile && (
                                        <span className="text-sm text-gray-500">{imageFile.name}</span>
                                    )}
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
                                        <button
                                            onClick={handleAddReward}
                                            className="cursor-pointer mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
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

                                {rewardsLoading && <p className="text-gray-500 mb-4">Loading rewards...</p>}
                                {rewardsError && <p className="text-red-500 mb-4">{rewardsError}</p>}

                                <div className=" overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredData.map((item) => (
                                        <div
                                            key={item._id}
                                            className="bg-gray-50 rounded-xl p-4 flex flex-col shadow-lg"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={`${IMAGE_BASE}${item.image}`}
                                                    alt={item.name}
                                                    className="h-24 w-full object-cover rounded mb-4"
                                                />
                                            ) : (
                                                <div className="h-24 bg-gray-200 rounded mb-4 flex items-center justify-center">
                                                    ICON
                                                </div>
                                            )}

                                            <h3 className="font-semibold">{item.name}</h3>

                                            <div className="flex justify-between text-sm my-2">
                                                <span className="text-green-600 font-semibold">
                                                    {item.points} pts
                                                </span>
                                                <span className="text-gray-500">
                                                    {item.stocks} left
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="flex-1">
                                                        <button
                                                            onClick={() => {
                                                                setOpenRewardModal(true);
                                                                setClickReward(item.name);
                                                            }}
                                                            className="w-full cursor-pointer mt-auto bg-blue-600 text-white rounded-lg py-2 ">
                                                            View
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 relative">
                                                        <button
                                                            onClick={() => {
                                                                setToEdit(true);
                                                                handleRewardEdit(item._id);
                                                            }}
                                                            className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {!rewardsLoading && filteredData.length === 0 && (
                                        <p className="text-gray-500 col-span-full text-center py-6">
                                            No rewards found.
                                        </p>
                                    )}
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
                                                    <td>{log.rewardName}</td>
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

                    {/* RULES TAB */}
                    {activeTab == "rules" && (
                        <>
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
                                                title="Add new rule"
                                                onClick={() => {
                                                    setToEdit(false);
                                                    setEditRuleData(null);
                                                    setOpenRulesModal(true);
                                                }}
                                                className="bg-green-600 text-white w-full flex p-2 rounded-lg cursor-pointer hover:bg-green-700"
                                            >
                                                <Plus />
                                                <p>Add new rule</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {rulesLoading && <p className="text-gray-500 mb-4">Loading rules...</p>}
                                {rulesError && <p className="text-red-500 mb-4">{rulesError}</p>}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredRules.map((r, idx) => (
                                        <div
                                            key={r._id}
                                            className="relative bg-gray-50 rounded-xl flex flex-col shadow-lg"
                                        >
                                            <div className="overflow-hidden">
                                                {r.image ? (
                                                    <img
                                                        src={`${IMAGE_BASE}${r.image}`}
                                                        alt={r.name}
                                                        className="w-full h-90 object-cover transform transition-transform rounded-tr-lg rounded-tl-lg duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-tr-lg rounded-tl-lg text-gray-400">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col p-4 gap-2">
                                                <div className="flex justify-between items-center">
                                                    <h1 className="text-lg font-bold"><span>Rule {idx + 1}</span> - {r.name}</h1>
                                                    <p className="text-sm text-gray-400 font-semibold text-center px-4 py-1 rounded-full">
                                                        {r.freq}
                                                    </p>
                                                </div>
                                                <p className="text-gray-500">
                                                    {r.decs}
                                                </p>
                                                <div className="w-full flex items-center gap-2 mt-4">

                                                    {!r.auto && (
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
                                                    )}
                                                    <div className="flex-1">
                                                        <button
                                                            onClick={() => {
                                                                setToEdit(true);
                                                                setEditRuleData(r);
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

                                    {!rulesLoading && filteredRules.length === 0 && (
                                        <p className="text-gray-500 col-span-full text-center py-6">
                                            No rules found.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                </main>

                <ClaimReward
                    isOpen={openClaimModal}
                    onClose={() => setopenClaimModal(false)}
                    rName={clickedReward}
                    rPoints={pointNeed}
                />

                <ViewRewardModal
                    isOpen={openRewardModal}
                    onClose={() => setOpenRewardModal(false)}
                    rName={clickedReward}
                />

                <RulesModal
                    isOpen={openRulesModal}
                    onClose={() => {
                        setOpenRulesModal(false);
                        setToEdit(false);
                        setEditRuleData(null);
                    }}
                    edit={ToEdit}
                    ruleData={editRuleData}
                    onSaved={fetchRules}
                />

                <ConfirmationModal
                    isOpen={openConModal}
                    onClose={() => setOpenConModal(false)}
                    onConfirm={handleUpdateReward}
                />

                <AwardModal
                    isOpen={openAwardModal}
                    onClose={() => { setopenAwardModal(false) }}
                    rule={clickedRule}
                />

            </div>
            <Footer />
        </div >
    );

}