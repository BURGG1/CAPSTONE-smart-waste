import { X, Calendar, Flag, PlusCircle, Trash2, Clipboard, Award } from "lucide-react";
import { useState } from "react";
import AssignPointsModal from "./AssignPointsModal";


const household = {
    id: "HH-202610001",
    name: "Joel Dela Cruz",
    address: "0543, Rizal Street",
    contact: "+63-917-123-4567",
    age: "34",
    members: 5,
    email: "delacruzjoel@gmail.com",
    registeredSince: "January 15, 2026",
    totalDisposals: 48,
    compliance: "Excellent",
    points: {
        total: 1240,
        thisMonth: 280,
    },
};


const disposalLogs = [
    {
        id: 1,
        counter: 7,
        binID: "BIN-001",
        binType: "Biodegradable",
        date: "2026-02-01",
        time: "09:52:08",
        resident: "Joel Dela Cruz",
        duration: "38s",
        points: 20,
    },
    {
        id: 2,
        counter: 7,
        binID: "BIN-002",
        binType: "Non-Biodegradable",
        date: "2026-02-01",
        time: "09:35:12",
        resident: "Joel Dela Cruz",
        duration: "41s",
        points: 20,
    },
    {
        id: 3,
        counter: 14,
        binID: "BIN-002",
        binType: "Non-Biodegradable",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Joel Dela Cruz",
        duration: "52s",
        points: 0,
    },
    {
        id: 4,
        counter: 14,
        binID: "BIN-001",
        binType: "Biodegradable",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Joel Dela Cruz",
        duration: "52s",
        points: 0,
    },
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
        date: "2026-02-12",
        rewardName: "Vitamins/Medicine",
        householdId: "HH-202610008",
        householdName: "Joel Dela Cruz",
        stockUpdate: -1,
    },
];

// recentActivityData
const recentActivityData = [
    {
        id: 1,
        type: "Earned points",
        via: "Rule 1. Return of recyclable material",
        amount: "2kg",
        date: "2026-01-24",
        points: 30,
    },
    {
        id: 2,
        type: "Redeemed Reward",
        via: "Vitamins/Medicine",
        amount: "1box",
        date: "2026-01-23",
        points: -500,
    },
    {
        id: 3,
        type: "Earned points",
        via: "Rule 2. 10-days Streak",
        amount: "_",
        date: "2026-01-22",
        points: 30,
    },
    {
        id: 4,
        type: "Earned points",
        via: "Rule 1. Return of recyclable material",
        amount: "3kg",
        date: "2026-01-22",
        points: 45,
    },


];

export default function HouseholdRecordModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("disposal")
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [openPointsModal, setOpenPointsModal] = useState(false);

    if (!isOpen) return null;

    const filteredLogs = disposalLogs.filter((log) => {
        if (!fromDate && !toDate) return true;
        const logDate = new Date(log.date);
        return (
            (!fromDate || logDate >= new Date(fromDate)) &&
            (!toDate || logDate <= new Date(toDate))
        );
    });

    const filteredReward = recentActivityData.filter((log) => {
        if (!fromDate && !toDate) return true;
        const logDate = new Date(log.date);
        return (
            (!fromDate || logDate >= new Date(fromDate)) &&
            (!toDate || logDate <= new Date(toDate))
        );
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-h-[500px] max-w-5xl rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-5 py-1 border-b">
                    <h3 className="text-gray-600 text-sm">Joel Dela Cruz's Record</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* FILTER */}
                <div className="w-full flex flex-col">

                    <div className="w-full flex flex-col md:flex-row justify-between  px-6 py-4 border-b">

                        <div className="flex-1 ">
                            <p>Name: <span className="font-semibold">{household.name}</span></p>
                            <p>Address: <span className="font-semibold">{household.address}</span></p>
                            <p>Age: <span className="font-semibold">{household.age}</span>yrs old</p>
                            <p>Member: <span className="font-semibold">{household.members}</span></p>
                        </div>
                        <div className="flex-1 ">
                            <p>Contact: <span className="font-semibold">{household.contact}</span></p>
                            <p>Email: <span className="font-semibold">{household.email}</span></p>
                            <p>Points: <span className="font-semibold text-green-600">{household.points.total}</span></p>
                        </div>

                    </div>

                    <div className="w-full flex flex-col md:flex-row px-6 py-2 border-b ">
                        <div className=" flex-1 flex items-center gap-2 w-auto">
                            <Calendar size={16} />
                            <p>Date:</p>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm w-50"
                            />
                        </div>
                        <div className="flex-1 flex justify-end gap-2">
                            <button
                                onClick={() => setOpenPointsModal(true)}    
                                className="flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700">
                                <Award size={14} />
                                Add Points
                            </button>

                        </div>
                    </div>
                </div>
                {/* TABS */}
                <div className="w-full flex overflow-x-auto bg-gray-200 rounded-tr-3xl rounded-tl-3xl mt-3 ml-1 px-1 justify-center md:w-fit justify-evenly text-[#4A3B47] pt-1 space-x-2">
                    {[
                        { id: "disposal", label: "Disposal Log", icon: <Trash2 size={15} /> },
                        { id: "reward", label: "Activity Log", icon: <Clipboard size={15} /> },

                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center m-0 justify-center md:justify-between cursor-pointer gap-2 px-4 py-1 whitespace-nowrap transition ${activeTab === tab.id
                                ? "bg-white rounded-tr-3xl rounded-tl-3xl text-gray-800"
                                : "text-gray-600 hover:bg-gray-200 rounded-tr-3xl rounded-tl-3xl"
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* DISPOSAL LOG */}
                {activeTab == "disposal" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-400">
                                <tr>
                                    <th className="py-3">Bin ID</th>
                                    <th>Bin Type</th>
                                    <th>Disposal order</th>
                                    <th>Date & Time</th>
                                    <th>Resident</th>
                                </tr>
                            </thead>

                            <tbody className="text-center">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id}>

                                        <td className=" py-3 font-medium">#{log.binID}</td>
                                        <td className=" py-3 font-medium">{log.binType}</td>

                                        <td className=" py-3 font-medium">#{log.counter}</td>
                                        <td>
                                            <p>{log.date}</p>
                                            <p className="text-xs text-gray-500">{log.time}</p>
                                        </td>

                                        <td>{log.resident}</td>

                                    </tr>
                                ))}

                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">
                                            No records found for selected dates
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ACTIVITY LOG */}
                {activeTab == "reward" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-400">
                                <tr>
                                    <th className="py-3">Date</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th className="px-4">Points</th>
                                </tr>
                            </thead>

                            <tbody className="text-center">
                                {filteredReward.map((activity) => (
                                    <tr key={activity.id}>
                                        <td>{activity.date}</td>
                                        <td className="w-fit py-3 font-medium">{activity.type}</td>
                                        <td>{activity.via}</td>
                                        <td>{activity.amount}</td>
                                        <td className={`font-semibold ${activity.points > 0
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}> {activity.points > 0
                                                ? `+${activity.points}`
                                                : activity.points}</td>
                                    </tr>
                                ))}

                                {filteredReward.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">
                                            No records found for selected dates
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            <AssignPointsModal
                isOpen={openPointsModal}
                onClose={() => setOpenPointsModal(false)}
            />

        </div>
    );
}
