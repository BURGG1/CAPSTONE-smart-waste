import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";


const rawData = [
  {
    family: "Santos Family",
    householdId: "HH-13579246",
    disposals: 62,
    points: 1580,
    trend: "up",
    isYou: false,
  },
  {
    family: "Martinez Family",
    householdId: "HH-75391482",
    disposals: 54,
    points: 1350,
    trend: "up",
    isYou: false,
  },
  {
    family: "Dela Cruz Family",
    householdId: "HH-24680135",
    disposals: 48,
    points: 1240,
    trend: "up",
    isYou: true,
  },
  {
    family: "Lopez Household",
    householdId: "HH-15948673",
    disposals: 38,
    points: 920,
    trend: "down",
    isYou: false,
  },
];


const medalStyles = {
  Gold: {
    ring: "border-yellow-400 text-yellow-500",
    podium: "bg-yellow-400",
  },
  Silver: {
    ring: "border-gray-300 text-gray-400",
    podium: "bg-gray-300",
  },
  Bronze: {
    ring: "border-orange-400 text-orange-500",
    podium: "bg-orange-400",
  },
};

const tierStyles = {
  Gold: "bg-yellow-100 text-yellow-700",
  Silver: "bg-gray-100 text-gray-700",
  Bronze: "bg-orange-100 text-orange-700",
};

const getTierByRank = (rank) => {
  if (rank === 1) return "Gold";
  if (rank === 2) return "Silver";
  if (rank === 3) return "Bronze";
  return null;
};


export default function Leaderboard() {

// dito sinosort yung rawData
  const rankedData = [...rawData]
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      tier: getTierByRank(index + 1),
    }));

  const podiumData = rankedData.slice(0, 3);

  return (
    <div className="flex-1">
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="w-full p-4 sm:p-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Community Leaderboard</h1>
            <p className="text-gray-500">
              See how you rank among other households in waste management
            </p>
          </div>

          {/* ===================== PODIUM ===================== */}
          <section className="bg-gradient-to-b from-green-50 to-white rounded-xl p-6 shadow">
            <div className="flex flex-col md:flex-row items-end justify-center gap-6">
              {[2, 1, 3].map((pos) => {
                const item = podiumData.find((i) => i.rank === pos);
                if (!item) return null;

                const style = medalStyles[item.tier];

                return (
                  <div
                    key={item.rank}
                    className={`flex flex-col items-center ${
                      item.rank === 1 ? "-mt-6" : ""
                    }`}
                  >
                    {/* Medal */}
                    <div
                      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3 ${style.ring}`}
                    >
                      {item.rank === 1 ? <Trophy /> : <Medal />}
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-xl shadow px-6 py-4 text-center min-w-[180px]">
                      <p className="text-2xl font-bold">
                        {item.rank === 1
                          ? "1st"
                          : item.rank === 2
                          ? "2nd"
                          : "3rd"}
                      </p>
                      <h3 className="font-semibold">{item.family}</h3>
                      <p className="text-green-600 font-bold mt-1">
                        {item.points} pts
                      </p>
                    </div>

                    {/* Podium Block */}
                    <div
                      className={`w-full mt-4 rounded-t-xl ${style.podium}`}
                      style={{
                        height:
                          item.rank === 1
                            ? "120px"
                            : item.rank === 2
                            ? "90px"
                            : "70px",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
                <Star className="text-yellow-400" size={16} />
                Top performers this month!
              </div>
            </div>
          </section>

          {/* ===================== TABLE ===================== */}
          <section className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">All Rankings</h2>
            </div>

            <div className="max-h-[400px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Household</th>
                    <th className="px-6 py-4 text-left">Tier</th>
                    <th className="px-6 py-4 text-left">Disposals</th>
                    <th className="px-6 py-4 text-left">Points</th>
                    <th className="px-6 py-4 text-left">Trend</th>
                  </tr>
                </thead>

                <tbody>
                  {rankedData.map((item) => (
                    <tr
                      key={item.householdId}
                      className={item.isYou ? "bg-green-50" : ""}
                    >
                      <td className="px-6 py-4 font-semibold">
                        #{item.rank}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium">{item.family}</div>
                        <div className="text-xs text-gray-500">
                          {item.householdId}
                        </div>
                        {item.isYou && (
                          <span className="inline-block mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {item.tier ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${tierStyles[item.tier]}`}
                          >
                            {item.tier}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">{item.disposals}</td>

                      <td className="px-6 py-4 font-bold text-green-600">
                        {item.points}
                      </td>

                      <td className="px-6 py-4">
                        {item.trend === "up" ? (
                          <TrendingUp className="text-green-600" size={18} />
                        ) : (
                          <TrendingDown className="text-red-600" size={18} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
