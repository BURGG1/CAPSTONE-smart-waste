import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

// raw data
const rawData = [
  { family: "Joel Dela Cruz", address: "Rizal St.", householdId: "HH-202610001", disposals: 62, points: 1580, trend: "up", isYou: true },
  { family: "Rolando Martinez", address: "Mabini St.", householdId: "HH-202610002", disposals: 54, points: 1350, trend: "up", isYou: false },
  { family: "Remedios Delo Santos", address: "Mabini St.", householdId: "HH-202610003", disposals: 48, points: 1240, trend: "up", isYou: false },
  { family: "Lopez Household", address: "Bonifacio St.", householdId: "HH-202610004", disposals: 38, points: 920, trend: "down", isYou: false },
];

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
  const [rankedData, setRankedData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    // simulate async fetch
    const loadData = async () => {
      // compute rank and tier
      const sorted = [...rawData]
        .sort((a, b) => b.points - a.points)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
          tier: getTierByRank(index + 1),
        }));

      if (isMounted) setRankedData(sorted);
    };

    loadData();

    return () => { isMounted = false };
  }, []);

  const podiumData = rankedData.slice(0, 3);

  return (
    <FlatList
      data={rankedData}
      keyExtractor={(item) => item.householdId}
      className="flex-1 px-4 py-6 mb-5 bg-gray-50"
      ListHeaderComponent={() => (
        <View className="space-y-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold">Community Leaderboard</Text>
            <Text className="text-gray-500">
              See how you rank among other households in waste management
            </Text>
          </View>

          {/* Podium */}
          <View className="bg-green-50 rounded-xl p-4 shadow space-y-4">
            {podiumData.map(item => (
              <View key={item.rank} className="bg-white rounded-xl shadow p-4 flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Text className="font-bold">#{item.rank}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold">{item.family}</Text>
                  <Text className="text-xs text-gray-400">{item.address}</Text>
                  <Text className="text-sm text-green-600 font-bold">{item.points} pts</Text>
                </View>
                {item.rank === 1 && <Feather name="award" size={24} color="#FACC15" />}
              </View>
            ))}

            <View className="mt-4 flex-row justify-center">
              <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Feather name="star" size={16} color="#FACC15" />
                <Text>Top performers this month!</Text>
              </View>
            </View>
          </View>

          {/* All Rankings Title */}
          <View className="bg-white rounded-tr-xl rounded-tl-xl shadow overflow-hidden mt-5">
            <View className="p-4 border-b">
              <Text className="text-xl font-bold">All Rankings</Text>
            </View>
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <View className={`flex-row justify-between items-center px-4 py-3 ${item.isYou ? "bg-green-50" : ""}`}>
          <Text className="font-semibold">#{item.rank}</Text>

          <View className="flex-1 px-2">
            <Text className="font-medium">{item.family}</Text>
            <Text className="text-xs text-gray-500">{item.householdId}</Text>
            {item.isYou && (
              <Text className="mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">You</Text>
            )}
          </View>

          <View className="px-2">
            {item.tier ? (
              <Text className={`px-3 py-1 rounded-full text-xs font-medium ${tierStyles[item.tier]}`}>{item.tier}</Text>
            ) : (
              <Text className="text-gray-400 text-xs">—</Text>
            )}
          </View>

          <Text className="px-2">{item.disposals}</Text>
          <Text className="px-2 font-bold text-green-600">{item.points}</Text>

          <View className="px-2">
            {item.trend === "up" ? (
              <Feather name="trending-up" size={18} color="#16A34A" />
            ) : (
              <Feather name="trending-down" size={18} color="#DC2626" />
            )}
          </View>
        </View>
      )}
    />
  );
}