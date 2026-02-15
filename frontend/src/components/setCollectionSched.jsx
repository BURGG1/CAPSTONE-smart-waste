import { X, Calendar, Flag, Plus, PlusCircle, Filter , Asterisk } from "lucide-react";
import { useState } from "react";



export default function SetSched({ isOpen, onClose }) {

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-100 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Register Household</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>


                <main className="flex justify-center p-5 items-center">

                    <div className="w-md flex flex-col justify-center gap-2">
                        {/* Fullname */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <p className="text-lg text-black-500 text-semibold">Fullname</p>
                                <Asterisk className="text-red-500 w-4 h-4" />
                            </div>
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 text-black rounded-lg border"
                                placeholder="ex. Janice S. Dela Cruz.."
                            />
                        </div>
                        {/* Date */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select

                                className="pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Category</option>
                                <option value="Biodegradable">Biodegradable</option>
                                <option value="Non-Biodegradable">Non-Biodegradable</option>
                            </select>
                        </div>
                        {/* Address */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <p className="text-lg text-black-500 text-semibold">Address</p>
                                <Asterisk className="text-red-500 w-4 h-4" />
                            </div>
                            <div className="w-full pl-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <p className="text-md text-black-500 text-semibold">House No.</p>
                                        <Asterisk className="text-red-500 w-3 h-4" />
                                    </div>
                                    <input
                                        type="text"

                                        className="flex-1 px-3 py-2 text-black rounded-lg border"
                                        placeholder="ex. 0123.."
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <p className="text-md text-black-500 text-semibold">Street/Avenue/Block</p>
                                        <Asterisk className="text-red-500 w-3 h-4" />
                                    </div>
                                    <input
                                        type="text"

                                        className="flex-1 px-3 py-2 text-black rounded-lg border"
                                        placeholder="ex. Rizal St.."
                                    />
                                </div>
                            </div>

                        </div>
                        {/* Contact Number */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <p className="text-lg text-black-500 text-semibold">Contact Number</p>
                                <Asterisk className="text-red-500 w-4 h-4" />
                            </div>
                            <input
                                type="tel"
                                className="flex-1 px-3 py-2 text-black rounded-lg border"
                                placeholder="ex. 0913-123-4314.."
                            />
                        </div>
                        {/* Email */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <p className="text-lg text-black-500 text-semibold">Email</p>
                            </div>
                            <input
                                type="email"
                                className="flex-1 px-3 py-2 text-black rounded-lg border"
                                placeholder="ex. janicedelacruz@gmail.com.."
                            />
                        </div>

                        <button className="cursor-pointer mt-5 bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                            Register
                        </button>
                    </div>

                </main>


            </div>
        </div>
    );
}
