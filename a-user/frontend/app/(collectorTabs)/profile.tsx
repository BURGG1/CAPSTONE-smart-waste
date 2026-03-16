import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import EditHousehold from "@/components/EditHouseholdModal";

// Collector Information
const collector = {
    id: "COL-202610001",
    name: "Chito Miranda",
    employeeId: "EMP-00045",
    assignedBarangay: "Barangay Sunshine",
    contact: "+63 917 888 2233",
    email: "chitomid@gmail.com",
    registeredSince: "February 10, 2025",
    totalCollections: 120,
};

// Collector Information Items
const infoItems = [
    { label: "Collector Name", value: collector.name, icon: "user" },
    { label: "Employee ID", value: collector.employeeId, icon: "clipboard" },
    { label: "Assigned Barangay", value: collector.assignedBarangay, icon: "map-pin" },
    { label: "Contact Number", value: collector.contact, icon: "phone" },
    { label: "Email", value: collector.email, icon: "mail" },
    { label: "Registered Since", value: collector.registeredSince, icon: "calendar" },
    { label: "Total Collections", value: `${collector.totalCollections} bins`, icon: "trash-2" },
];

export default function CollectorProfile() {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        router.replace("/");
    };

    return (

        <SafeAreaView className="flex-1">

            <ScrollView className="flex-1 px-4 py-1">

                {/* Page Header */}
                <View>
                    <Text className="text-3xl font-bold">Collector Profile</Text>
                    <Text className="text-gray-500 mb-6">
                        View and manage collector information
                    </Text>
                </View>

                {/* Collector Information */}
                <View className="bg-white rounded-xl shadow p-6 space-y-4">

                    <Text className="text-lg font-semibold mb-4">
                        Collector Information
                    </Text>

                    <View className="flex flex-col flex-wrap gap-4">

                        {infoItems.map((item) => (

                            <View
                                key={item.label}
                                className="w-full flex-row items-center gap-4 bg-gray-50 rounded-xl p-4 flex-1"
                            >

                                <View className="p-3 bg-green-100 rounded-lg">

                                    {item.icon === "user" && (
                                        <Feather name="user" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "clipboard" && (
                                        <Feather name="clipboard" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "map-pin" && (
                                        <Feather name="map-pin" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "phone" && (
                                        <Feather name="phone" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "mail" && (
                                        <Feather name="mail" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "calendar" && (
                                        <Feather name="calendar" size={20} color="#16A34A" />
                                    )}

                                    {item.icon === "trash-2" && (
                                        <Feather name="trash-2" size={20} color="#16A34A" />
                                    )}

                                </View>

                                <View>
                                    <Text className="text-sm text-gray-500">
                                        {item.label}
                                    </Text>

                                    <Text className="font-semibold">
                                        {item.value}
                                    </Text>
                                </View>

                            </View>

                        ))}

                    </View>

                    {/* Update Button */}
                    <View className="flex items-center mt-4">

                        <TouchableOpacity
                            onPress={() => setIsModalOpen(true)}
                        >
                            <Text className="text-gray-400 underline">
                                Update information
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                {/* Logout Button */}
                <View className="w-full items-center mt-4 mb-4">

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-gray-600 px-4 py-2 rounded-lg"
                    >

                        <View className="flex-row items-center gap-2">

                            <Feather name="log-out" size={18} color="white" />

                            <Text className="text-white">
                                Logout
                            </Text>

                        </View>

                    </TouchableOpacity>

                </View>
            </ScrollView>

        </SafeAreaView>

    );
}