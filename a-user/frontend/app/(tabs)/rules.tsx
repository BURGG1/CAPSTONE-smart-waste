import { useState } from "react";
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Linking } from "react-native";
import { Feather } from "@expo/vector-icons"; // Expo Icons
import { SafeAreaView } from "react-native-safe-area-context";


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

export default function Rules() {
    const [search, setSearch] = useState("");

    return (
        <SafeAreaView className="flex-1">

            <ScrollView className="flex-1 px-4 py-2 ">
                {/* Header */}
                <View>
                    <Text className="text-3xl font-bold">Rules & Penalties</Text>
                    <Text className="text-gray-500 mb-6">Rules aligned with RA 9003</Text>
                </View>

                
                {/* Penalties & Deductions */}
                <View className="flex flex-col gap-2 bg-red-50 border border-red-200 shadow-lg rounded-xl p-6 space-y-4 mb-5">
                    <View>
                        <Text className="text-lg font-semibold text-red-700">Penalties & Deductions</Text>
                        <Text className="text-sm text-red-600 mt-1">
                            Based on Republic Act No. 9003 - Ecological Solid Waste Management Act
                        </Text>
                    </View>

                    {penaltiesData.records.map((item, index) => (
                        <View
                            key={index}
                            className="bg-white border border-red-200 rounded-lg p-4 flex-col justify-between items-center"
                        >
                            <View>
                                <Text className="font-medium">{item.reason}</Text>
                                <Text className="text-xs text-gray-500">{item.date}</Text>
                            </View>
                            <View className="">
                                <Text className="text-red-600 font-semibold">{item.points} pts</Text>
                                <Text className="text-xs text-gray-400">{item.law}</Text>
                            </View>
                        </View>
                    ))}

                    <View className="bg-white border border-red-300 rounded-lg p-3 text-sm">
                        <Text className="text-red-600">
                            <Text className="font-bold">Note: </Text>
                            {penaltiesData.note}
                        </Text>
                    </View>
                </View>



{/* RA 9003 */}
                <View className="bg-white rounded-xl p-6 shadow">

                    <View className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-5">
                        <View className="flex-row items-start gap-4">

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
                    className="flex-row items-center gap-2 mb-10"
                >
                    <Text className="text-green-600 font-medium">See full text of RA 9003</Text>
                </TouchableOpacity>



                {/* Rules Section */}
                <View className="bg-white rounded-xl p-6 shadow">
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


            </ScrollView>
        </SafeAreaView>

    );
}