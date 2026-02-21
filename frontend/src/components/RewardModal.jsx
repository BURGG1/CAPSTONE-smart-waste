
import { X, Calendar, Flag, PlusCircle, Asterisk, Camera } from "lucide-react";
import { useState } from "react";

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

export function ViewRewardModal({ isOpen, onClose }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    if (!isOpen) return null;

    const filteredLogs = rewardLogs.filter((log) => {
        if (!fromDate && !toDate) return true;
        const logDate = new Date(log.date);
        return (
            (!fromDate || logDate >= new Date(fromDate)) &&
            (!toDate || logDate <= new Date(toDate))
        );
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Reward History</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* FILTER */}
                <div className="w-full flex flex-col sm:flex-row gap-4 px-6 py-4 border-b">
                    <div className=" flex items-center gap-2 w-auto sm:w-full">
                        <Calendar size={16} />
                        <p>Date Collected:</p>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-50"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
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
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="py-3 font-medium">#{log.date}</td>

                                    <td>
                                        {log.rewardName}
                                    </td>
                                    <td>{log.householdId}</td>

                                    <td>{log.householdName}</td>

                                    <td className="text-red-500">{log.stockUpdate}</td>
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

            </div>
        </div>
    );
}
