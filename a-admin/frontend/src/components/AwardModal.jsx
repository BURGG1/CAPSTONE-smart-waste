import { X, Calendar, Pin, Flag, Search, PlusCircle } from "lucide-react";
import { useState } from "react";

const disposalLogs = [
    {
        id: 1,
        date: "2026-02-01",
        time: "09:52:08",
        duration: "38s",
        houseId: "HH-202610001",
        resident: "Joel Dela Cruz",
        address: "Rizal St.",
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
        address: "Mabini St.",
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
        address: "Mabini St.",
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
        address: "Rizal St.",
        contact: "+63-917-123-4567",
        email: "cecilgarcia13@gmail.com"
    },
    {
        id: 5,
        date: "2026-01-31",
        time: "08:12:44",
        duration: "52s",
        houseId: "HH-202610005",
        resident: "Amado Aquino",
        address: "Mabini St.",
        contact: "+63-917-123-4567",
        email: "amads_@gmail.com"
    },
    {
        id: 6,
        date: "2026-01-31",
        time: "08:12:44",
        duration: "52s",
        houseId: "HH-202610006",
        resident: "Rolando Martinez",
        address: "Bonifacio St.",
        contact: "+63-917-123-4567",
        email: "odnalor1234@gmail.com"
    },
    {
        id: 7,
        date: "2026-01-31",
        time: "08:12:44",
        duration: "52s",
        houseId: "HH-202610007",
        resident: "Martin Lopez",
        address: "Bonifacio St.",
        contact: "+63-917-123-4567",
        email: "martinlopez@gmail.com"
    },

];


export default function AwardModal({ isOpen, onClose, rule }) {

    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" }); // "Monday", etc
    const formattedDate = today.toISOString().split("T")[0]; // "2026-02-22"

    const [selectedIds, setSelectedIds] = useState([]);
    const [location, setLocation] = useState();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState("");

    const [search, setSearch] = useState("")

    const [quantity, setQuantity] = useState(1);
    const [points, setPoints] = useState(1240);
    let awardedPoints = 0;

    if (!isOpen) return null;

    const filteredLogs = disposalLogs.filter((log) => {
        if (!fromDate && !toDate) return true;
        const logDate = new Date(log.date);
        return (
            (!fromDate || logDate >= new Date(fromDate)) &&
            (!toDate || logDate <= new Date(toDate))
        );
    });

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            // remove if already selected
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            // add if not selected
            setSelectedIds([...selectedIds, id]);
        }
    };


    // for calcu

    if (rule) {
        if (typeof rule.points === "number") {
            awardedPoints = rule.points * quantity;


        } else if (typeof rule.points === "object") {
            awardedPoints = rule.points.minPoints * quantity;
        }
    }

    const totalPoints = points + awardedPoints;

    let calculation = "";

    if (rule) {
        if (typeof rule.points === "number") {
            calculation = `${rule.points} × ${quantity} = ${awardedPoints}`;
        } else if (typeof rule.points === 1) {
            calculation = `${rule.points.minPoints} × ${quantity} = ${awardedPoints} (min applied)`;
        }
    }


    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white h-auto max-h-[650px] w-full max-w-5xl rounded-2xl shadow-lg flex flex-col">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-1 border-b">
                    <h2 className="text-md text-gray-600 font-semi-bold">Assign Points</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* Filter */}
                <div className="w-full flex flex-col gap-5 px-4 py-2 border-b lg:flex-row">
                    <div className="flex-1">
                        <h2 className="text-md font-bold md:text-lg">Rule {rule.id} - <span>{rule.name}</span></h2>
                        <p>{rule.decs}</p>
                        
                        <p className="text-green-400 font-bold">{rule.points} points <span className="text-gray-400 font-normal">-{rule.freq}</span></p>

                    </div>
                    <div className="flex flex-col gap-2 w-auto">

                        {/* <Calendar className="w-4 h-4 md:w-5 h-5" />
                        <p>Date Collected:</p>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-50"
                        /> */}

                        <div className="relative">
                            <Search className="absolute left-3 top-5 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search household"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="relative">
                            <Pin className="absolute left-3 top-5 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Location</option>
                                <option value="Rizal st."> Rizal Street </option>
                                <option value="Mabini st."> Mabini Street </option>
                                <option value="Bonifacio st."> Bonifacio Street </option>

                            </select>
                        </div>
                    </div>
                </div>

                {/* TABLE-------------------- */}
                <div className="flex-2 h-[300px] overflow-y-auto overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Household ID</th>
                                <th>Address</th>
                                <th>Resident</th>
                                <th>Contact no.</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>

                                    <td>{log.houseId}</td>

                                    <td className="px-6 py-3">{log.address}</td>

                                    <td>{log.resident}</td>
                                    <td>{log.contact}</td>
                                    <td>{log.email}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(log.id)}
                                            onChange={() => handleCheckboxChange(log.id)}
                                        />
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
                {/* POINTTTS----------------------- */}
                <div className="flex flex-col justify-between mt-4 border-t p-4 gap-5 lg:flex-row">

                    <div className="flex-1 bg-green-100 p-4 rounded-lg">
                        <div className="flex justify-between pb-3 border-b border-gray-500">
                            <div className="flex flex-col">
                                <h1 className="font-semibold">Points to be Awarded</h1>
                                <p className="text-green-600 font-bold text-2xl">
                                    +{awardedPoints}
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <h1 className="font-semibold">Total Points</h1>
                                <p className="text-green-600 font-bold text-2xl">
                                    {totalPoints}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs p-2">Calculation: {calculation}</p>

                    </div>
                    <div className="flex-1">

                        {/* Quantity */}
                        <div className="w-full flex flex-col">
                            <label className="font-semibold">Quantity</label>
                            <input
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                type="number"
                                className="mt-1 px-3 py-2 rounded-lg border w-full"
                            />
                        </div>
                        {/* Submit Button */}
                        <button
                            onClick={() => setActive(true)}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Assign Points
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}
