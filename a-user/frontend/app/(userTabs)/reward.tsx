import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"; // Expo icons
import { SafeAreaView } from "react-native-safe-area-context";

// household information
const household = {
    id: "HH-202610002",
    name: "Remedios Delo Santos",
    address: "0543, Mabini Street",
    contact: "+63 917 123 4567",
    members: 5,
    email: "remediosdelosantos@gmail.com",
    registeredSince: "January 15, 2026",
    totalDisposals: 48,
    streak: 2,
    compliance: "Excellent",
    points: { total: 1240, thisMonth: 280 },
};

// Points summary
const POINTS = {
    total: 1240,
    tier: "Silver",
    maxTierPoints: 1500,
    remaining: 260,
};

// Monthly stats
const MONTHLY = {
    earned: 280,
    redeemed: 200,
    net: 80,
};

// Redeemable items
const REWARDS = [
    { id: 1, name: "Free Clinical Checkup", points: 1200, stocks: 15 },
    { id: 2, name: "50% off to Barangay Clearance", points: 1200, stocks: 8 },
    { id: 3, name: "Vitamins/Medicine", points: 500, stocks: 20 },
    { id: 4, name: "50% off to Business Permit", points: 1500, stocks: 5 },

];

// Derived values
const progressPercent = Math.round((POINTS.total / POINTS.maxTierPoints) * 100);

// Penalty Data
const penaltiesData = {
    note:
        "Repeated violations may result in additional penalties and suspension of waste disposal privileges.",
    records: [
        {
            reason:
                "Improper waste segregation (mixed biodegradable with non-biodegradable)",
            date: "2026-01-15",
            points: -500,
            law: "RA 9003 Section 48",
        },
    ],
};

// recentActivityData
const recentActivityData = [
    {
        type: "Earned points",
        via: "Rule 1. Return of recyclable material",
        amount: "2kg",
        date: "2026-01-24",
        points: 30,
    },
    {
        type: "Redeemed Reward",
        via: "Vitamins/Medicine",
        amount: "1pc",
        date: "2026-01-23",
        points: -500,
    },
    {
        type: "Earned points",
        via: "Rule 2. 10-days Streak",
        date: "2026-01-22",
        points: 30,
    },
    {
        type: "Earned points",
        via: "Rule 1. Return of recyclable material",
        amount: "3kg",
        date: "2026-01-22",
        points: 45,
    },
];

export default function Rewards() {
    return (
    <SafeAreaView className="flex-1">

        <ScrollView className="flex-1 px-4 py-2 ">

            <View className="flex flex-col gap-5">
                {/* Header */}
                <View>
                    <Text className="text-2xl font-bold">Rewards & Achievements</Text>
                    <Text className="text-gray-500">Redeem your points for eco-friendly items</Text>
                </View>

                {/* Top Section */}
                <View className="flex flex-col xl:flex-row gap-6">
                    {/* Reward Points */}
                    <View className="bg-green-600 rounded-xl p-6 shadow flex-1 space-y-4">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Text className="text-white font-semibold">Reward Points</Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-4xl font-bold text-white">{household.points.total}</Text>
                                <Text className="text-green-100">Total Points Earned</Text>
                            </View>

                            {/* Streak */}
                            <View className="bg-green-600 p-2 rounded-xl border border-green-700 items-center justify-center">
                                <Text className="text-2xl font-bold text-white">{household.streak} days</Text>
                                <Text className="text-white text-center">Streak</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between text-sm text-green-100">
                            <Text>This Month</Text>
                            <Text className="font-semibold">+{household.points.thisMonth} points</Text>
                        </View>
                    </View>

                    {/* This Month */}
                    <View className="bg-white rounded-xl p-6 shadow flex-1 space-y-4">
                        <View className="flex-row items-center gap-2">
                            <Feather name="trending-up" size={20} color="#16A34A" />
                            <Text className="font-semibold">This Month</Text>
                        </View>

                        <View className="space-y-2 text-sm">
                            <View className="flex-row justify-between">
                                <Text>Points Earned</Text>
                                <Text className="text-green-600 font-semibold">+{MONTHLY.earned}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text>Points Redeemed</Text>
                                <Text className="text-red-500 font-semibold">-{MONTHLY.redeemed}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Redeemable Items */}
                <View className="bg-white rounded-xl p-6 shadow space-y-4">
                    <View className="flex-row items-center gap-2 mb-4">
                        <MaterialCommunityIcons name="gift" size={20} color="#16A34A" />
                        <Text className="text-lg font-semibold">Redeemable Items</Text>
                    </View>

                    <View className="flex flex-wrap gap-4">
                        {REWARDS.map((item) => (
                            <View key={item.name} className="bg-gray-50 rounded-xl p-4 flex-1 min-w-[140px] w-full">
                                <View className="h-24 bg-gray-200 rounded mb-4 items-center justify-center">
                                    <Text>ICON</Text>
                                </View>
                                <Text className="font-semibold">{item.name}</Text>
                                <View className="flex-row justify-between text-sm my-2">
                                    <Text className="text-green-600 font-semibold">{item.points} pts</Text>
                                    <Text className="text-gray-500">{item.stocks} left</Text>
                                </View>
                                <TouchableOpacity className="mt-auto bg-green-600 py-2 rounded-lg items-center">
                                    <Text className="text-white font-semibold">Redeem</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Recent Activity */}
                <View className="bg-white rounded-xl p-6 shadow flex-1">
                    <Text className="text-lg font-semibold mb-4">Recent Activity</Text>
                    <ScrollView className="flex-1 space-y-4">
                        {recentActivityData.map((activity, index) => (
                            <View key={index} className="flex-row justify-between items-center">
                                <View>
                                    <Text className="font-medium">{activity.type}</Text>
                                    <Text className="text-xs">
                                        {activity.via}
                                        {activity.amount && ` - ${activity.amount}`}
                                    </Text>
                                    <Text className="text-xs text-gray-500">{activity.date}</Text>
                                </View>
                                <Text
                                    className={`font-semibold ${activity.points > 0 ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {activity.points > 0 ? `+${activity.points}` : activity.points}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>

    );
}