import { X, Asterisk } from "lucide-react";
import { useState } from "react";
import SuccessToast from "../assets/Toast";

export default function AssignRFIDModal({ isOpen, onClose, onAssign }) {
    const [rfid, setRfid] = useState("");
    const [toast, setToast] = useState(false);

    if (!isOpen) return null;

    const handleAssign = () => {
        if (!rfid) return;
        onAssign(rfid); // send RFID to parent
        setRfid("");
        onClose();
    };

    const handleRegister = () =>{
        onClose();
        setToast(true);
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Assign RFID</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-500 hover:text-gray-800" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 flex flex-col gap-4">

                    <div className="flex flex-col items-center">
                        <div className="flex items-center">

                            <h3 className="text-lg font-semibold">Assign RFID</h3>
                            <Asterisk className="text-red-500 w-3 h-3" />
                        </div>

                        <p className="text-sm text-gray-500">
                            Scan or input RFID for this household
                        </p>

                    </div>

                    {/* RFID INPUT */}
                    <div className="flex items-center">

                        <input
                            type="text"
                            placeholder="Scan RFID or enter code"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-4">

                        <button
                            onClick={() => handleRegister()}
                            className="flex-1 bg-green-600 cursor-pointer text-white py-2 rounded-lg"
                        >
                            Register
                        </button>
                    </div>

                

                </div>
            </div>
        </div>
    );
}