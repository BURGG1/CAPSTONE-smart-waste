import { X, Asterisk, Award } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "./confirmationModal";

import pandisplay from "../resources/pandisplay.jpg"
import plasticBrick from "../resources/plastic-brick.jpg"
import recyc1 from "../resources/recyc1.jpg"
import tenDay from "../resources/tenDays.jpg"
import oneMonth from "../resources/oneMonth.jpg"

const RULES = [
    {
        image: recyc1,
        id: 1,
        name: "Recyclable Materials",
        decs: "Earn points by recycling normal materials such as plastic, paper, glass, and metal",
        points: 15,
        freq: "per kilo"
    },
    {
        image: tenDay,
        id: 2,
        name: "10-Day Consistency Streak",
        decs: "Maintain proper bin usage without any violation for 10 consecutive days",
        points: 30,
        freq: "per streak"
    },
    {
        image: plasticBrick,
        id: 3,
        name: "Plastic Bottle Bricks",
        decs: "Create eco-bricks by filling plastic bottles with non-recyclable plastic waste to be used for construction",
        points: 50,
        freq: "per brick"
    },
    {
        image: oneMonth,
        id: 4,
        name: "1 month Consistency Streak",
        decs: "Maintain proper bin usage without any violation for 1 month",
        points: 100,
        freq: "per streak"
    },
    {
        image: pandisplay,
        id: 5,
        name: "Recycled Items or Accessories",
        decs: "Already recycled items transformed into display pieces or accessories. Points vary based on design creativity and quality",
        points: 1,
        freq: "per item"
    },

];

export default function AssignPointsModal({ isOpen, onClose }) {
    const [active, setActive] = useState(false);
    const [search, setSearch] = useState("Recyclable Materials");
    const [quantity, setQuantity] = useState(1);
    const [points, setPoints] = useState(1240);


    const selectedRule = RULES.find(rule => rule.name === search);

    if (!isOpen) return null;

    const filteredData = RULES.filter((h) => {
        const matchSearch =
            h.name.toLowerCase().includes(search.toLowerCase())

        return matchSearch;
    });

    let awardedPoints = 0;

    if (selectedRule) {
        if (typeof selectedRule.points === "number") {
            awardedPoints = selectedRule.points * quantity;


        } else if (typeof selectedRule.points === "object") {
            awardedPoints = selectedRule.points.minPoints * quantity;
        }
    }


    const totalPoints = points + awardedPoints;
    
    let calculation = "";

    if (selectedRule) {
        if (typeof selectedRule.points === "number") {
            calculation = `${selectedRule.points} × ${quantity} = ${awardedPoints}`;
        } else if (typeof selectedRule.points === 1) {
            calculation = `${selectedRule.points.minPoints} × ${quantity} = ${awardedPoints} (min applied)`;
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-2 border-b">
                    <h2 className="text-lg sm:text-xl font-bold">
                        Assign Points
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 hover:text-gray-800" />
                    </button>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto px-4 sm:px-6 py-5">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col">

                            {/* frequency */}
                            <label className="font-semibold flex items-center gap-1">
                                Select Rule
                                <Asterisk className="text-red-500 w-3 h-3" />
                            </label>
                            <select
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Recyclable Materials">Select Rule</option>

                                {RULES.map((rule) => (
                                    <option key={rule.id} value={rule.name}>
                                        Rule {rule.id} - {rule.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {filteredData.map((r) => (
                                <div
                                    key={r.id}
                                    className="relative bg-gray-50 rounded-xl flex flex-col shadow-lg"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={r.image}
                                            alt={r.name}
                                            className="w-full h-40 object-cover transform transition-transform rounded-tr-lg rounded-tl-lg duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex flex-col p-4 gap-2">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-bold"><span>Rule {r.id}</span> - {r.name}</h1>
                                            <p className="text-sm text-gray-400 font-semibold text-center px-4 py-1 rounded-full">
                                                -{r.freq}
                                            </p>
                                        </div>
                                        <p className="text-gray-500">
                                            {r.decs}
                                        </p>
                                    </div>

                                    <div className="bg-white absolute top-2 right-2 rounded-lg p-2 shadow-md">
                                        <h2 className="flex flex-col text-center text-green-500 font-bold text-xl">
                                            +{
                                                typeof r.points === "number"
                                                    ? r.points
                                                    : `${r.points.minPoints}-${r.points.maxPoints}`
                                            }
                                            <span className="text-gray-500 text-sm font-semibold">points</span>
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="font-semibold">Quantity</label>
                            <input
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                type="number"
                                className="mt-1 px-3 py-2 rounded-lg border w-full"
                            />
                        </div>

                        <div className="bg-green-100 p-4 rounded-lg">
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


                        {/* Submit Button */}
                        <button
                            onClick={() => setActive(true)}
                            className="mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Assign Points
                        </button>

                    </div>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={active}
                    onClose={() => setActive(false)}
                    onConfirm={()=>{
                        setActive(false);
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}