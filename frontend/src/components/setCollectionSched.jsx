import { X, Calendar, Flag, Plus, PlusCircle, Filter, Asterisk } from "lucide-react";
import { useState } from "react";



export default function SetSched({ isOpen, onClose }) {

    if (!isOpen) return null;


    return (
        <>
            {/* Click Outside Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Tooltip Panel */}
            <div className="absolute top-full flex flex-col left-0 mt-2 w-80 bg-white border shadow-lg rounded-xl p-4 z-100">

                <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t"></div>

                <h4 className="font-semibold mb-3 text-sm">
                    Schedule Collection
                </h4>

                <select

                    className="w-full border rounded-md px-3 py-2 text-sm mb-3"
                >
                    <option value="all">Collection Personel</option>
                    <option value="jeff">Jeffry Agustin</option>
                    <option value="quen">Queenie Legaspi</option>
                    <option value="saki">Masaki Saito</option>
                </select>

                <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm mb-3"
                />

                <button
                    className="w-full bg-green-600 text-white py-2 rounded-md text-sm"
                    onClick={onClose}
                >
                    Confirm
                </button>
            </div>
        </>
    );
}
