import { useState, useEffect } from "react";
import { View, FlatList, Text, ScrollView, Image, TextInput, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getRules } from "../../api/rulesAPI"; // API function to fetch rules

const recentActivityData = [
    { type: "Earned points", via: "Rule 1. Return of recyclable material", amount: "2kg", date: "2026-01-24", points: 30 },
    { type: "Redeemed Reward", via: "Vitamins/Medicine", amount: "1pc", date: "2026-01-23", points: -500 },
    { type: "Earned points", via: "Rule 2. 10-days Streak", date: "2026-01-22", points: 30 },
    { type: "Earned points", via: "Rule 1. Return of recyclable material", amount: "3kg", date: "2026-01-22", points: 45 },
];

type Rule = {
    _id: string;
    name: string;
    decs?: string;
    freq?: string;
    points?: number;
    image?: string;
    [key: string]: any;
};

type Household = {
    fullname?: string;
    rank?: number;
    points?: {
        total?: number;
        thisMonth?: number;
    };
    [key: string]: any;
};

export default function Home() {
    const [search, setSearch] = useState("");
    const [household, setHousehold] = useState<Household | null>(null);
    const [loading, setLoading] = useState(true);

    // ---- Rules now come from the database ----
    const [rules, setRules] = useState<Rule[]>([]);
    const [rulesLoading, setRulesLoading] = useState(true);
    const [rulesError, setRulesError] = useState("");

    useEffect(() => {
        const fetchHousehold = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const userStr = await AsyncStorage.getItem("user");
                const user = userStr ? JSON.parse(userStr) : null;
                if (!user?.id) return;

                const res = await fetch(`${API_BASE}/api/households/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setHousehold(data.data);
            } catch (err) {
                console.error("Failed to fetch household:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHousehold();
    }, []);

    const fetchRules = async () => {
        try {
            setRulesLoading(true);
            const data = await getRules();
            setRules(data);
            setRulesError("");
        } catch (err) {
            console.error(err);
            setRulesError("Failed to load rules. Is the server running?");
        } finally {
            setRulesLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const filteredRules = rules.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#16A34A" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1 px-4 py-2">

                {/* Header */}
                <View>
                    <Text className="text-3xl font-bold">Home</Text>
                    <Text className="text-gray-500 mb-6">Keep up the great work with waste segregation</Text>
                </View>

                {/* Reward Points */}
                <View className="bg-green-600 text-white rounded-xl shadow p-6 gap-4">
                    <Text className="text-white">Welcome back,</Text>
                    <Text className="text-4xl text-white font-bold">{household?.fullname ?? "—"}!</Text>

                    <View className="flex-row items-center gap-2">
                        <Feather name="award" size={20} color="white" />
                        <Text className="font-semibold text-white">Total Points Earned</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-4xl font-bold text-white">{household?.points?.total ?? 0}</Text>
                            <Text className="text-green-100">Total Points Earned</Text>
                        </View>
                        <View className="bg-green-600 p-2 rounded-xl border border-green-700 items-center justify-center">
                            <Text className="text-2xl font-bold text-white">#{household?.rank ?? "—"}</Text>
                            <Text className="text-white text-center">Current rank</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between text-sm">
                        <Text className="text-white">This Month</Text>
                        <Text className="font-semibold text-white">+{household?.points?.thisMonth ?? 0} points</Text>
                    </View>
                </View>

                {/* Rules Section */}
                <View className="bg-white rounded-xl p-6 shadow mt-10">
                    <View className="flex-col justify-between items-center mb-4 gap-2">
                        <View className="flex-row items-center gap-2">
                            <Feather name="clipboard" size={18} color="#16A34A" />
                            <Text className="text-lg font-semibold">How to Earn Points</Text>
                        </View>
                        <View className="relative flex-row items-center">
                            <Feather name="search" size={18} color="gray" className="absolute left-2" />
                            <TextInput
                                className="pl-8 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-green-500"
                                placeholder="Search reward"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                    </View>

                    {rulesLoading && (
                        <View className="items-center py-6">
                            <ActivityIndicator color="#16A34A" />
                            <Text className="text-gray-500 mt-2">Loading rules...</Text>
                        </View>
                    )}

                    {!!rulesError && (
                        <Text className="text-red-500 mb-2">{rulesError}</Text>
                    )}

                    <FlatList
                        data={filteredRules}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{ gap: 10 }}
                        contentContainerStyle={{ gap: 10 }}
                        ListEmptyComponent={
                            !rulesLoading && !rulesError ? (
                                <Text className="text-gray-500 text-center py-6 w-full">
                                    No rules found.
                                </Text>
                            ) : null
                        }
                        renderItem={({ item: r, index }) => (
                            <View className="flex-1 bg-gray-50 rounded-xl shadow-lg overflow-hidden">
                                {r.image ? (
                                    <Image
                                        source={{ uri: r.image }}
                                        className="w-full h-40"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-40 bg-gray-200 items-center justify-center">
                                        <Text className="text-gray-400">No image</Text>
                                    </View>
                                )}
                                <View className="p-3 gap-1">
                                    <Text className="text-sm font-bold">Rule {index + 1}</Text>
                                    <Text className="text-xs text-gray-500">{r.name}</Text>
                                    <Text className="text-xs text-gray-400">{r.decs}</Text>
                                    <Text className="text-xs text-gray-400">{r.freq}</Text>
                                </View>
                                <View className="absolute top-2 right-2 bg-white rounded-lg p-1 shadow-md">
                                    <Text className="text-green-500 font-bold text-sm text-center">+{r.points}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* RA 9003 */}
                <View className="bg-white rounded-xl p-6 shadow mt-10">
                    <View className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-5">
                        <View className="flex-row items-start gap-4">
                            <View>
                                <Text className="text-xl font-bold text-gray-800">Republic Act No. 9003</Text>
                                <Text className="text-green-700 text-sm">Ecological Solid Waste Management Act of 2000</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full gap-1 self-start">
                            <Text className="text-green-700 text-xs font-medium">Philippine Law</Text>
                        </View>
                    </View>
                    <View className="bg-green-100/60 border border-green-200 rounded-xl p-4 mt-5">
                        <Text className="text-sm text-gray-700 text-justify">
                            The Ecological Solid Waste Management Act of 2000, officially known as Republic Act No. 9003,
                            is a Philippine environmental law enacted to establish a comprehensive and sustainable system
                            for managing solid waste nationwide.
                            <Text className="font-semibold">
                                {" "}It promotes waste reduction, mandatory segregation at source, recycling, composting,
                                and the closure of open dumpsites, while requiring local government units to take primary
                                responsibility for implementation under the supervision of the Department of Environment
                                and Natural Resources.
                            </Text>
                            {" "}The law aims to protect public health and the environment by shifting the country from improper
                            disposal practices to an ecological and community-based waste management approach.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => Linking.openURL("https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003/")}
                    className="flex-row items-center gap-2"
                >
                    <Text className="text-green-600 font-medium">See full text of RA 9003</Text>
                </TouchableOpacity>

                {/* Recent Activity */}
                <View className="bg-white rounded-xl p-6 shadow mt-5">
                    <Text className="text-lg font-semibold mb-4">Recent Activity</Text>
                    {recentActivityData.map((activity, i) => (
                        <View key={i} className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="font-medium">{activity.type}</Text>
                                <Text className="text-xs">{activity.via}{activity.amount ? ` - ${activity.amount}` : ""}</Text>
                                <Text className="text-xs text-gray-500">{activity.date}</Text>
                            </View>
                            <Text className={`font-semibold ${activity.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {activity.points > 0 ? `+${activity.points}` : activity.points}
                            </Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}