import {
    X,
    Asterisk,
    Star,
    TrendingUp,
    Gift,
    BookCheck,
    Gavel,
    Plus,
    Camera,
    ClipboardCheck
} from "lucide-react";
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
        points: "50-200",
        freq: "per item"
    },


];

export default function RulesModal({ isOpen, onClose, edit }) {


    const [ToEdit, setToEdit] = useState();
    const [active, setActive] = useState(false);

    const [rule, setRule] = useState("")
    const [desc, setDesc] = useState("")
    const [eqPoints, setEqPoints] = useState("")
    const [freq, setFreq] = useState("")

    const handleRulesEdit = (id) => {
        const item = RULES.find((rules) => rules.id === id);
        if (!item) return;

        setRule(item.rule);
        setDesc(item.decs);
        setEqPoints(item.points);
        setFreq(item.freq);
    };

    const ClearRulesEdit = () => {
        setRule("");
        setEqPoints("");
        setEqPoints("");
        setFreq("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-4">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Gavel className="text-green-600" />
                        {edit ? ("Update Rule") : ("Add New Rule")}
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 cursor-pointer hover:text-gray-800" />
                    </button>
                </div>

                <section className="bg-white rounded-xl pt-0 p-6 shadow">
                    {/* Image Upload */}
                    <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700 transition">
                            <Camera size={16} />
                            Upload Image
                            <input type="file" accept="image/*" className="hidden" />
                        </label>

                    </div>

                    <div className="grid grid-cols-1 gap-3">


                        <div className="flex items-center">
                            <Asterisk className="text-red-500 w-4 h-4" />
                            <input
                                value={rule}
                                onChange={(e) => setRule(e.target.value)}
                                className="w-full px-3 py-2 text-black rounded-lg border"
                                placeholder="Name"
                            />
                        </div>

                        <div className="flex items-center">

                            <Asterisk className="text-red-500 w-4 h-4" />

                            <textarea name="
                                        " id=""
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full px-3 py-2 text-black rounded-lg border"
                                placeholder="Description"
                                type="desciption"
                                step="0.01"
                            >
                            </textarea>
                        </div>

                        <div className="flex items-center">

                            <Asterisk className="text-red-500 w-4 h-4" />
                            <input
                                value={eqPoints}
                                onChange={(e) => setEqPoints(e.target.value)}
                                className="w-full px-3 py-2 text-black rounded-lg border"
                                placeholder="Points"
                                type="number"
                            />

                        </div>

                          <div className="flex items-center">

                                {/* frequency */}
                                <Asterisk className="text-red-500 w-4 h-4" />
                                <select
                                    value={freq}
                                    onChange={(e) => setFreq(e.target.value)}
                                    className="w-full py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Frequency</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Monthly">Per Collection</option>
                                    <option value="per kilo">Per kilo</option>
                                    <option value="per streak">Per streak</option>
                                    <option value="per item">Per item</option>
                                </select>
                            </div>
                    </div>
                    {/* Buttons */}
                    <div className="mt-3 flex justify-end gap-2">
                        {edit ? (
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setOpenConModal(true)}
                                    className="cursor-pointer mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                    Update Item
                                </button>

                                <button
                                    onClick={() => {
                                        setToEdit(false);
                                        ClearRewardEdit();
                                    }}
                                    className="cursor-pointer mt-auto bg-gray-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-gray-700 transition">
                                    Cancel
                                </button>

                            </div>) : (
                            <button className="cursor-pointer mt-auto bg-green-600 flex items-center justify-center gap-1 text-white rounded-lg p-2 hover:bg-green-700 transition">
                                <Plus size={16} />
                                Add New Rule
                            </button>
                        )}

                    </div>
                </section>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={active}
                    onClose={() => setActive(false)}
                />
            </div>
        </div>
    );
}