import { X, Asterisk } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "./confirmationModal";

export default function AddHousehold({ isOpen, onClose }) {
  const [active, setActive] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold">
            Register Household
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Fullname */}
            <div className="flex flex-col">
              <label className="font-semibold flex items-center gap-1">
                Fullname
                <Asterisk className="text-red-500 w-3 h-3" />
              </label>
              <input
                type="text"
                className="mt-1 px-3 py-2 rounded-lg border w-full"
                placeholder="ex. Janice Dela Cruz"
              />
            </div>

            {/* Birthday + Family Member */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold">Birthday</label>
                <input
                  type="date"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Family Member</label>
                <input
                  type="number"
                  className="mt-1 px-3 py-2 rounded-lg border w-full"
                  placeholder="ex. 5"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold flex items-center gap-1">
                Address
                <Asterisk className="text-red-500 w-3 h-3" />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    House No.
                  </label>
                  <input
                    type="text"
                    className="mt-1 px-3 py-2 rounded-lg border w-full"
                    placeholder="ex. 0123"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    Street / Block
                  </label>
                  <input
                    type="text"
                    className="mt-1 px-3 py-2 rounded-lg border w-full"
                    placeholder="ex. Rizal St."
                  />
                </div>
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="font-semibold flex items-center gap-1">
                Contact Number
                <Asterisk className="text-red-500 w-3 h-3" />
              </label>

              <div className="mt-1 flex items-center border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-gray-900">
                <div className="bg-gray-100 px-3 py-2 text-gray-700 text-sm">
                  🇵🇭 +63
                </div>
                <input
                  type="tel"
                  placeholder="912-345-6789"
                  className="flex-1 px-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="font-semibold">Email</label>
              <input
                type="email"
                className="mt-1 px-3 py-2 rounded-lg border w-full"
                placeholder="jdelacruz@email.com"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setActive(true)}
              className="mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Register
            </button>

          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={active}
          onClose={() => setActive(false)}
        />
      </div>
    </div>
  );
}