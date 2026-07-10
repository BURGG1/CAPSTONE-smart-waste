import { X, Calendar, Clipboard, Trash2, Award } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AssignPointsModal from "./AssignPointsModal";
import BASE_URL from "../config";

function computeAge(birthday) {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default function HouseholdRecordModal({ isOpen, onClose, household: householdProp }) {
    const [household, setHousehold]     = useState(null);  // ← local fresh copy
    const [activeTab, setActiveTab]     = useState("disposal");
    const [fromDate, setFromDate]       = useState("");
    const [toDate, setToDate]           = useState("");
    const [openPointsModal, setOpenPointsModal] = useState(false);

    // Disposal logs
    const [disposalLogs, setDisposalLogs]   = useState([]);
    const [logsLoading, setLogsLoading]     = useState(false);
    const [logsError, setLogsError]         = useState("");

    // Activity logs
    const [activityLogs, setActivityLogs]       = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityError, setActivityError]     = useState("");
    const [activityPage, setActivityPage]       = useState(1);
    const [activityTotal, setActivityTotal]     = useState(0);
    const ACTIVITY_LIMIT = 15;

    // ── Fetch fresh household data ────────────────────────────────────────────
    const fetchHousehold = useCallback(async () => {
        if (!householdProp?._id) return;
        try {
            const res  = await fetch(`${BASE_URL}/api/households/${householdProp._id}`);
            const data = await res.json();
            if (data.success) setHousehold(data.data);
        } catch (err) {
            console.error("Failed to refresh household:", err);
        }
    }, [householdProp?._id]);

    // ── Fetch disposal logs ───────────────────────────────────────────────────
    const fetchDisposalLogs = useCallback(async () => {
        if (!householdProp?.rfid) return;
        setLogsLoading(true);
        setLogsError("");
        try {
            const res  = await fetch(`${BASE_URL}/api/rfid/logs/${householdProp.rfid}`);
            const data = await res.json();
            if (data.success) {
                setDisposalLogs(data.data.filter((log) => log.action === "dispose"));
            } else {
                setLogsError("Failed to load disposal logs.");
            }
        } catch {
            setLogsError("Network error. Could not load logs.");
        } finally {
            setLogsLoading(false);
        }
    }, [householdProp?.rfid]);

    // ── Fetch activity logs ───────────────────────────────────────────────────
    const fetchActivityLogs = useCallback(async (page = 1) => {
        if (!householdProp?._id) return;
        setActivityLoading(true);
        setActivityError("");
        try {
            const params = new URLSearchParams({
                page,
                limit: ACTIVITY_LIMIT,
                ...(fromDate && { from: fromDate }),
                ...(toDate   && { to: toDate }),
            });

            const res  = await fetch(`${BASE_URL}/api/households/${householdProp._id}/activity?${params}`);
            const data = await res.json();

            if (data.success) {
                setActivityLogs(data.data);
                setActivityTotal(data.pagination?.total ?? 0);
                setActivityPage(page);
            } else {
                setActivityError("Failed to load activity logs.");
            }
        } catch {
            setActivityError("Network error. Could not load activity.");
        } finally {
            setActivityLoading(false);
        }
    }, [householdProp?._id, fromDate, toDate]);

    // ── On open: load everything fresh ───────────────────────────────────────
    useEffect(() => {
        if (!isOpen || !householdProp?._id) return;
        setHousehold(householdProp); // show immediately while fetching
        fetchHousehold();
        fetchDisposalLogs();
        fetchActivityLogs(1);
        setActiveTab("disposal");
        setFromDate("");
        setToDate("");
        setActivityPage(1);
    }, [isOpen, householdProp?._id]);

    // ── Re-fetch activity when date filter changes ────────────────────────────
    useEffect(() => {
        if (!isOpen || activeTab !== "reward") return;
        fetchActivityLogs(1);
    }, [fromDate, toDate]);

    // ── Called after points are awarded ──────────────────────────────────────
    const handlePointsAwarded = useCallback(async () => {
        await fetchHousehold();        // refresh points in header
        await fetchActivityLogs(1);   // refresh activity log
    }, [fetchHousehold, fetchActivityLogs]);

    if (!isOpen || !household) return null;

    // ── Derived display values ────────────────────────────────────────────────
    const fullname        = household.fullname || "—";
    const address         = [household.address?.houseNo, household.address?.street].filter(Boolean).join(", ") || "—";
    const age             = computeAge(household.birthday);
    const familyMembers   = household.familyMember ?? "—";
    const contact         = household.contactNumber ? `+63-${household.contactNumber}` : "—";
    const email           = household.email || "—";
    const rfid            = household.rfid || "—";
    const householdId     = household._id ? `HH-${household._id.slice(-8).toUpperCase()}` : "—";
    const registeredSince = formatDate(household.createdAt);
    const points          = household.points?.total ?? 0;
    const violation       = household.violation ?? 0;
    const suffix          = ["st", "nd", "rd"];

    // ── Filter disposal logs ──────────────────────────────────────────────────
    const filteredLogs = disposalLogs.filter((log) => {
        if (!fromDate && !toDate) return true;
        const logDate = new Date(log.scannedAt);
        return (
            (!fromDate || logDate >= new Date(fromDate)) &&
            (!toDate   || logDate <= new Date(toDate))
        );
    });

    const totalActivityPages = Math.ceil(activityTotal / ACTIVITY_LIMIT);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-h-[500px] max-w-5xl rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-5 py-1 border-b">
                    <h3 className="text-gray-600 text-sm">{fullname}'s Record</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                {/* INFO */}
                <div className="w-full flex flex-col">
                    <div className="w-full flex flex-col md:flex-row justify-between px-6 py-4 border-b">
                        <div className="flex-1 text-left space-y-0.5">
                            <p className="text-sm">ID: <span className="font-semibold">{householdId}</span></p>
                            <p className="text-sm">Name: <span className="font-semibold">{fullname}</span></p>
                            <p className="text-sm">Address: <span className="font-semibold">{address}</span></p>
                            <p className="text-sm">Age: <span className="font-semibold">{age !== null ? `${age} yrs old` : "—"}</span></p>
                            <p className="text-sm">Members: <span className="font-semibold">{familyMembers}</span></p>
                            <p className="text-sm">Registered: <span className="font-semibold">{registeredSince}</span></p>
                        </div>
                        <div className="flex-1 text-left space-y-0.5">
                            <p className="text-sm">Contact: <span className="font-semibold">{contact}</span></p>
                            <p className="text-sm">Email: <span className="font-semibold">{email}</span></p>
                            <p className="text-sm">RFID: <span className="font-semibold font-mono">{rfid}</span></p>
                            <p className="text-sm">
                                Points:{" "}
                                <span className="font-semibold text-green-600 transition-all duration-300">
                                    {points}
                                </span>
                            </p>
                            <p className="text-sm">
                                Violations:{" "}
                                {violation === 0 ? (
                                    <span className="font-semibold">No violation</span>
                                ) : (
                                    <span className="font-semibold text-red-500">
                                        {violation}{suffix[violation - 1] ?? "th"} offense
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Date filter + Add Points */}
                    <div className="w-full flex flex-col gap-2 md:flex-row px-6 py-2 border-b">
                        <div className="flex-1 flex items-center gap-2 w-auto">
                            <Calendar size={16} />
                            <p className="text-sm">Date:</p>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm w-50"
                            />
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end gap-2">
                            <button
                                onClick={() => setOpenPointsModal(true)}
                                className="flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700"
                            >
                                <Award size={14} />
                                Add Points
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="w-full flex overflow-x-auto bg-gray-200 rounded-tr-3xl rounded-tl-3xl mt-3 ml-1 px-1 justify-center md:w-fit justify-evenly text-[#4A3B47] pt-1 space-x-2">
                    {[
                        { id: "disposal", label: "Disposal Log",  icon: <Trash2 size={15} /> },
                        { id: "reward",   label: "Activity Log",  icon: <Clipboard size={15} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id === "reward") fetchActivityLogs(1);
                            }}
                            className={`flex items-center m-0 justify-center md:justify-between cursor-pointer gap-2 px-4 py-1 whitespace-nowrap transition ${
                                activeTab === tab.id
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
                {activeTab === "disposal" && (
                    <div className="overflow-x-auto overflow-y-auto max-h-[160px]">
                        {logsLoading ? (
                            <p className="text-center py-6 text-gray-400">Loading logs...</p>
                        ) : logsError ? (
                            <p className="text-center py-6 text-red-500">{logsError}</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-400 sticky top-0">
                                    <tr>
                                        <th className="py-3">Bin ID</th>
                                        <th>Bin Type</th>
                                        <th>Disposal Order</th>
                                        <th>Date & Time</th>
                                        <th>Resident</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {filteredLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-gray-500">
                                                No records found for selected dates
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLogs.map((log) => {
                                            const scannedAt    = new Date(log.scannedAt);
                                            const date         = scannedAt.toLocaleDateString("en-CA");
                                            const time         = scannedAt.toLocaleTimeString("en-US", {
                                                hour: "2-digit", minute: "2-digit", second: "2-digit",
                                            });
                                            const binTypeMatch = log.note?.match(/\((.+)\)/);
                                            const binType      = binTypeMatch ? binTypeMatch[1] : "—";
                                            return (
                                                <tr key={log._id}>
                                                    <td className="py-3 font-medium">#{log.binId ?? "—"}</td>
                                                    <td className="py-3 font-medium">{binType}</td>
                                                    <td className="py-3 font-medium">#{log.disposalOrder ?? "—"}</td>
                                                    <td>
                                                        <p>{date}</p>
                                                        <p className="text-xs text-gray-500">{time}</p>
                                                    </td>
                                                    <td>{log.household?.fullname ?? fullname}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ACTIVITY LOG */}
                {activeTab === "reward" && (
                    <div className="overflow-x-auto">
                        {activityLoading ? (
                            <p className="text-center py-6 text-gray-400">Loading activity...</p>
                        ) : activityError ? (
                            <p className="text-center py-6 text-red-500">{activityError}</p>
                        ) : (
                            <>
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
                                        {activityLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                                    No records found
                                                </td>
                                            </tr>
                                        ) : (
                                            activityLogs.map((activity) => (
                                                <tr key={activity._id}>
                                                    <td>{new Date(activity.date).toLocaleDateString("en-CA")}</td>
                                                    <td className="w-fit py-3 font-medium">{activity.type}</td>
                                                    <td className="px-2 max-w-[180px] text-center break-words whitespace-normal">
                                                        {activity.description}
                                                    </td>
                                                    <td>{activity.amount}</td>
                                                    <td className={`font-semibold ${activity.points > 0 ? "text-green-600" : "text-red-500"}`}>
                                                        {activity.points > 0 ? `+${activity.points}` : activity.points}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {totalActivityPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 py-2 border-t">
                                        <button
                                            disabled={activityPage === 1}
                                            onClick={() => fetchActivityLogs(activityPage - 1)}
                                            className="px-3 py-1 text-sm rounded-lg border disabled:opacity-40 hover:bg-gray-100"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            {activityPage} / {totalActivityPages}
                                        </span>
                                        <button
                                            disabled={activityPage === totalActivityPages}
                                            onClick={() => fetchActivityLogs(activityPage + 1)}
                                            className="px-3 py-1 text-sm rounded-lg border disabled:opacity-40 hover:bg-gray-100"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <AssignPointsModal
                isOpen={openPointsModal}
                onClose={() => setOpenPointsModal(false)}
                household={household}
                onAwarded={handlePointsAwarded}
            />
        </div>
    );
}