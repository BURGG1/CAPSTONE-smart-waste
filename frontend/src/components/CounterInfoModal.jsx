import { X, Calendar, Flag, PlusCircle } from "lucide-react";
import { useState } from "react";

const disposalLogs = [
    {
        id: 1,
        date: "2026-02-01",
        time: "09:52:08",
        duration: "38s",
        houseId: "HH-202610001",
        resident: "Joel Dela Cruz",
        contact: "+63-917-123-4567",
        email: "delacruzjoel@gmail.com"
    },
    {
        id: 2,
        date: "2026-02-01",
        time: "09:35:12",
        duration: "41s",
        houseId: "HH-202610002",
        resident: "Remedios Delo Santos",
        contact: "+63-917-123-4567",
        email: "remydelosantos@gmail.com"
    },
    {
        id: 3,
        date: "2026-01-31",
        time: "08:12:44",
        duration: "52s",
        houseId: "HH-202610003",
        resident: "Ramon Reyes",
        contact: "+63-917-123-4567",
        email: "rreyes1234@gmail.com"
    },
    {
        id: 4,
        date: "2026-01-31",
        time: "08:12:44",
        duration: "52s",
        houseId: "HH-202610004",
        resident: "Cecilia Garcia",
        contact: "+63-917-123-4567",
        email: "cecilgarcia13@gmail.com"
    },

];


export default function CounterInfoModal({ isOpen, onClose, bin }) {
    
    const today = new Date(); 
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" }); // "Monday", etc
    const formattedDate = today.toISOString().split("T")[0]; // "2026-02-22"
    
    const [fromDate, setFromDate] = useState();
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
            <div className="bg-white max-h-[500px] w-full max-w-5xl rounded-2xl shadow-lg flex flex-col">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-1 border-b">
                    <h2 className="text-md text-gray-600 font-semi-bold">Counter Information</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* Filter */}
                <div className="w-full flex flex-col justify-between items-center sm:flex-row px-4 py-2 border-b">
                    <div className="flex-1">
                        <h2 className="text-md font-bold md:text-lg">{bin.id} - <span>{bin.type}</span></h2>
                    </div>
                    <div className=" flex items-center gap-2 w-auto">

                        <Calendar className="w-4 h-4 md:w-5 h-5" />
                        <p>Date Collected:</p>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-50"
                        />
                        {/* <Calendar className="w-4 h-4 md:w-5 h-5" />
                        <p>Day:</p>
                        <select
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-50 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">{dayName}</option>
                            <option value="Monday"> Monday </option>
                            <option value="Tuesday"> Tuesday </option>
                            <option value="Wednesday"> Wednesday </option>
                            <option value="Thrusday"> Thrusday </option>
                            <option value="Friday"> Friday </option>
                            <option value="Saturday"> Saturday </option>
                            <option value="Sunday"> Sunday </option>
                        </select> */}
                    </div>
                </div>

                {/* TABLE */}
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3">Date & Time</th>
                                <th>Household ID</th>
                                <th>Disposal order</th>
                                <th>Resident</th>
                                <th>Contact no.</th>
                                <th>Email</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <p>{log.date}</p>
                                        <p className="text-xs text-gray-500">{log.time}</p>
                                    </td>
                                    <td>{log.houseId}</td>

                                    <td className="px-6 py-3 font-medium">#{log.id}</td>

                                    <td>{log.resident}</td>
                                    <td>{log.contact}</td>
                                    <td>{log.email}</td>

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
