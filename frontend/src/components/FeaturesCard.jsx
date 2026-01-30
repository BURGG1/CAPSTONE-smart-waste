import { Trash2, QrCode, Trophy } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function FeatureCard() {
  return (
    <div className="bg-green-500 rounded-2xl p-6 shadow-xl text-white w-full max-w-lg">
      {/* Top icons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Feature icon={Trash2} label="Smart Bins" />
        <Feature icon={QrCode} label="QR Tracking" />
        <Feature icon={Trophy} label="Rewards" />
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-5 space-y-4 text-gray-800">
        <ProgressBar label="Biodegradable" value={75} color="bg-green-500" />
        <ProgressBar label="Non-biodegradable" value={45} color="bg-orange-500" />
        <ProgressBar label="Recyclable" value={60} color="bg-blue-500" />
      </div>
    </div>
  );
}


function Feature({ icon: Icon, label }) {
  return (
    <div className="bg-green-400 rounded-xl py-4 flex flex-col items-center gap-2">
      <Icon size={28} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
