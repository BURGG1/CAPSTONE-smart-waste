
import { X, Calendar, Flag, PlusCircle, Asterisk, Camera } from "lucide-react";
import { useState } from "react";

const disposalLogs = [
    {
        id: 1,
        houseId: "HH-202610001",
        date: "2026-02-01",
        time: "09:52:08",
        resident: "Dela Cruz Family",
        duration: "38s",
        points: 20,
        status: "Compliant",
    },
    {
        id: 2,
        houseId: "HH-202610002",
        date: "2026-02-01",
        time: "09:35:12",
        resident: "Lopez Household",
        duration: "41s",
        points: 20,
        status: "Compliant",
    },
    {
        id: 3,
        houseId: "HH-202610003",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Reyes Family",
        duration: "52s",
        points: 0,
        status: "Flagged",
    },
    {
        id: 4,
        houseId: "HH-202610004",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Reyes Family",
        duration: "52s",
        points: 0,
        status: "Flagged",
    },

];

export function ViewRewardModal({ isOpen, onClose }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    if (!isOpen) return null;

    const filteredLogs = disposalLogs.filter((log) => {
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
                                <th className="px-6 py-3">Disposal order</th>
                                <th>Date & Time</th>
                                <th>Household ID</th>
                                <th>Resident</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-3 font-medium">#{log.id}</td>

                                    <td>
                                        <p>{log.date}</p>
                                        <p className="text-xs text-gray-500">{log.time}</p>
                                    </td>

                                    <td>{log.houseId}</td>


                                    <td>{log.resident}</td>


                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button className="flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700">
                                                <PlusCircle size={14} />
                                                Add Points
                                            </button>

                                            <button className="flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200">
                                                <Flag size={14} />
                                                Flag
                                            </button>
                                        </div>
                                    </td>
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
