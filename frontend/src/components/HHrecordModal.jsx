import { X, Calendar, Flag, PlusCircle } from "lucide-react";
import { useState } from "react";

const disposalLogs = [
    {
        id: 1,
        counter: 7,
        binID: "BIN-001",
        date: "2026-02-01",
        time: "09:52:08",
        resident: "Dela Cruz Family",
        duration: "38s",
        points: 20,
    },
    {
        id: 2,
        counter: 7,
        binID: "BIN-002",
        date: "2026-02-01",
        time: "09:35:12",
        resident: "Dela Cruz Family",
        duration: "41s",
        points: 20,
    },
    {
        id: 3,
        counter: 14,
        binID: "BIN-002",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Dela Cruz Family",
        duration: "52s",
        points: 0,
    },
    {
        id: 4,
        counter: 14,
        binID: "BIN-001",
        date: "2026-01-31",
        time: "08:12:44",
        resident: "Dela Cruz Family",
        duration: "52s",
        points: 0,
    },

];

export default function HouseholdRecordModal({ isOpen, onClose }) {
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
                    <h2 className="text-lg font-bold">Dela Cruz <span>Records</span></h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* FILTER */}
                <div className="w-full flex flex-col md:flex-row gap-4 px-6 py-4 border-b">
                    <div className=" flex-1 flex items-center gap-2 w-auto">
                        <Calendar size={16} />
                        <p>Date Collected:</p>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-50"
                        />
                    </div>
                    <div className="flex-1 flex justify-end gap-2">
                        <button className="flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700">
                            <PlusCircle size={14} />
                            Add Points
                        </button>

                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3">Bin ID</th>
                                <th >Disposal order</th>
                                <th>Date & Time</th>
                                <th>Resident</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>

                                    <td className=" py-3 font-medium">#{log.binID}</td>
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

            </div>
        </div>
    );
}
