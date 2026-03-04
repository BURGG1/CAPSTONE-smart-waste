import { useState } from "react";
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Linking } from "react-native";
import { Feather } from "@expo/vector-icons"; // Expo Icons

import pandisplay from "../../assets/pandisplay.jpg";
import plasticBrick from "../../assets/plastic-brick.jpg";
import recyc1 from "../../assets/recyc1.jpg";
import tenStreak from "../../assets/tenStreak.png";
import oneMonth from "../../assets/oneMonth.jpg";

// household info
const household = {
    id: "HH-202610001",
    name: "Joel Dela Cruz",
    address: "123 Green Street, Barangay Sunshine, Metro City",
    contact: "+63 917 123 4567",
    members: 5,
    registeredSince: "January 15, 2026",
    totalDisposals: 48,
    compliance: "Excellent",
    points: {
        total: 1240,
        thisMonth: 280,
    },
};

// reward rules
const RULES = [
    { image: recyc1, id: 1, name: "Recyclable Materials", decs: "Earn points by recycling normal materials such as plastic, paper, glass, and metal", points: 15, freq: "per kilo" },
    { image: tenStreak, id: 2, name: "10-Day Consistency Streak", decs: "Maintain proper bin usage without any violation for 10 consecutive days", points: 30, freq: "per streak" },
    { image: plasticBrick, id: 3, name: "Plastic Bottle Bricks", decs: "Create eco-bricks by filling plastic bottles with non-recyclable plastic waste to be used for construction", points: 50, freq: "per brick" },
    { image: oneMonth, id: 4, name: "1 month Consistency Streak", decs: "Maintain proper bin usage without any violation for 1 month", points: 100, freq: "per streak" },
    { image: pandisplay, id: 5, name: "Recycled Items or Accessories", decs: "Already recycled items transformed into display pieces or accessories. Points vary based on design creativity and quality", points: "50-200", freq: "per item" },
];

// recent activity
const recentActivityData = [
    { type: "Earned points", via: "Rule 1. Return of recyclable material", amount: "2kg", date: "2026-01-24", points: 30 },
    { type: "Redeemed Reward", via: "Vitamins/Medicine", amount: "1pc", date: "2026-01-23", points: -500 },
    { type: "Earned points", via: "Rule 2. 10-days Streak", date: "2026-01-22", points: 30 },
    { type: "Earned points", via: "Rule 1. Return of recyclable material", amount: "3kg", date: "2026-01-22", points: 45 },
];

export default function Home() {
    const [search, setSearch] = useState("");

    return (

        <ScrollView className="flex-1 px-4 py-5 mt-5 mb-5">
            {/* Header */}
            <View>
                <Text className="text-3xl font-bold">Home</Text>
                <Text className="text-gray-500 mb-6">Keep up the great work with waste segregation</Text>
            </View>

            {/* Reward Points */}
            <View className="bg-green-600 text-white rounded-xl shadow p-6 gap-4">
                <Text className="text-white">Welcome back,</Text>
                <Text className="text-4xl text-white font-bold">{household.name}!</Text>

                <View className="flex-row items-center gap-2">
                    <Feather name="award" size={20} color="white" />
                    <Text className="font-semibold text-white">Total Points Earned</Text>
                </View>
                <Text className="text-4xl font-bold text-white">{household.points.total}</Text>
                <View className="flex-row justify-between text-sm">
                    <Text className="text-white">This Month</Text>
                    <Text className="font-semibold text-white">+{household.points.thisMonth} points</Text>
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
                {/* RULEES------------ */}
                <ScrollView className="gap-4">
                    {RULES.map(r => (
                        <ScrollView key={r.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden mb-4">
                            <Image source={r.image} className="w-full h-80" resizeMode="cover" />
                            <View className="p-4 gap-2">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-lg font-bold">Rule {r.id} - {r.name}</Text>
                                    <Text className="text-sm text-gray-400 font-semibold px-3 py-1 rounded-full">-{r.freq}</Text>
                                </View>
                                <Text className="text-gray-500">{r.decs}</Text>
                            </View>
                            <View className="absolute top-2 right-2 bg-white rounded-lg p-2 shadow-md">
                                <Text className="text-green-500 font-bold text-xl text-center">+{r.points}</Text>
                                <Text className="text-gray-500 text-sm font-semibold text-center">points</Text>
                            </View>
                        </ScrollView>
                    ))}
                </ScrollView>
            </View>

            {/* RA 9003 */}
            <View className="bg-white rounded-xl p-6 shadow mt-10">

                <View className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-5">
                    <View className="flex-row items-start gap-4">
                        <View className="bg-green-100 p-3 rounded-xl">
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-gray-800">
                                Republic Act No. 9003
                            </Text>
                            <Text className="text-green-700 text-sm">
                                Ecological Solid Waste Management Act of 2000
                            </Text>
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
                            It promotes waste reduction, mandatory segregation at source, recycling, composting,
                            and the closure of open dumpsites, while requiring local government units to take primary
                            responsibility for implementation under the supervision of the Department of Environment
                            and Natural Resources.
                        </Text>
                        The law aims to protect public health and the environment by shifting the country from improper
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

    );
}