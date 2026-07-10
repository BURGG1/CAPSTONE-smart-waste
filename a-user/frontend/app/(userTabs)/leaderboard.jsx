import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "@/config";

const POLL_INTERVAL_MS = 5000;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const myHouseholdIdRef = useRef(null);
  const isMountedRef = useRef(true);

  // ── Resolve which household is "me", once per mount ──
  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem("householdId");
        myHouseholdIdRef.current = storedId || null;
      } catch (err) {
        console.error("Failed to read household id from storage:", err);
      }
    })();
  }, []);

  // ── Fetch + rank households from the API ──
  const fetchLeaderboard = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/households?limit=50&isActive=true`);
      const data = await res.json();

      if (!data.success) throw new Error("Failed to fetch leaderboard");

      const ranked = [...(data.data ?? [])]
        .sort((a, b) => (b.points?.total ?? 0) - (a.points?.total ?? 0))
        .slice(0, 50)
        .map((hh, index) => ({
          family: hh.fullname,
          address: [hh.address?.houseNo, hh.address?.street].filter(Boolean).join(", ") || "—",
          householdId: `HH-${hh._id.slice(-8).toUpperCase()}`,
          rawId: hh._id,
          points: hh.points?.total ?? 0,
          disposals: hh.disposals ?? 0,
          trend: "up",
          rank: index + 1,
          tier: getTierByRank(index + 1),
          isYou: myHouseholdIdRef.current ? hh._id === myHouseholdIdRef.current : false,
        }));

      if (isMountedRef.current) {
        setRankedData(ranked);
        setError(false);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      if (isMountedRef.current) setError(true);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // ── Initial load + polling for real-time updates ──
  useEffect(() => {
    isMountedRef.current = true;

    fetchLeaderboard();

    const intervalId = setInterval(() => {
      fetchLeaderboard({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchLeaderboard]);

  // ── Pull-to-refresh ──
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard({ silent: true });
  };

  const podiumData = rankedData.slice(0, 3);

  // ── Loading skeleton (first load only) ──
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="text-gray-400 mt-3">Loading leaderboard...</Text>
      </SafeAreaView>
    );
  }

  // ── Error state ──
  if (error && rankedData.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Feather name="alert-triangle" size={28} color="#DC2626" />
        <Text className="text-red-500 mt-3 text-center">Failed to load leaderboard.</Text>
        <Text className="text-gray-400 text-xs mt-1 text-center">Pull down to try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={rankedData}
        keyExtractor={(item) => item.householdId}
        className="flex-1 px-4 py-2 bg-gray-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#16A34A"]} />
        }
        ListHeaderComponent={() => (
          <View className="space-y-6">
            {/* Header */}
            <View>
              <Text className="text-3xl font-bold">Community Leaderboard</Text>
              <Text className="text-gray-500">
                See how you rank among other households in waste management
              </Text>
            </View>

            {/* Empty state */}
            {rankedData.length === 0 ? (
              <View className="bg-white rounded-xl shadow p-8 items-center">
                <Text className="text-gray-400">No household data yet.</Text>
              </View>
            ) : (
              <>
                {/* Podium */}
                <View className="flex flex-col gap-2 bg-green-50 rounded-xl p-4 shadow space-y-4">
                  {podiumData.map((item) => (
                    <View
                      key={item.rank}
                      className={`bg-white rounded-xl shadow p-4 flex-row items-center gap-4 ${item.isYou ? "border border-green-400" : ""
                        }`}
                    >
                      <View className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Text className="font-bold">#{item.rank}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold">{item.family}</Text>
                        <Text className="text-xs text-gray-400">{item.address}</Text>
                        <Text className="text-sm text-green-600 font-bold">{item.points} pts</Text>
                        {item.isYou && (
                          <Text className="mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full self-start">
                            You
                          </Text>
                        )}
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
              </>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <View className={`flex-row justify-between items-center px-4 py-2 ${item.isYou ? "bg-green-50" : ""}`}>
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
                <Text className={`px-3 py-1 rounded-full text-xs font-medium ${tierStyles[item.tier]}`}>
                  {item.tier}
                </Text>
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
    </SafeAreaView>
  );
}
