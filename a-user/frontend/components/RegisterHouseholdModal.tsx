import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RegisterHouseholdProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterHousehold({ isOpen, onClose }: RegisterHouseholdProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullname: "",
        familyMember: "",
        houseNo: "",
        street: "",
        email: "",
        contactNumber: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        if (!form.fullname || !form.houseNo || !form.street) {
            Alert.alert("Required", "Fullname and address are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://192.168.1.226:5000/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullname: form.fullname,
                    familyMember: form.familyMember ? parseInt(form.familyMember) : null,
                    address: {
                        houseNo: form.houseNo,
                        street: form.street,
                    },
                    email: form.email || null,
                    contactNumber: form.contactNumber || null,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                Alert.alert("Error", data.message || "Something went wrong.");
                return;
            }

            Alert.alert(
                "Request Submitted!",
                "Your registration is pending admin approval. You will receive your credentials via email once approved.",
                [{ text: "OK", onPress: onClose }]
            );

            setForm({ fullname: "", familyMember: "", houseNo: "", street: "", email: "", contactNumber: "" });
        } catch (err) {
            Alert.alert("Error", "Cannot connect to server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={isOpen} className="bg-white" animationType="fade">
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center p-4"
                onPress={onClose}
            >
                <Pressable
                    className="bg-white w-full max-w-lg rounded-2xl overflow-hidden"
                    onPress={() => { }}
                >
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
                        <Text className="text-lg font-bold">Register Household</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="p-5">

                        {/* Fullname */}
                        <View className="mb-3">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold">Fullname</Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>
                            <TextInput
                                placeholder="ex. Janice S. Dela Cruz.."
                                value={form.fullname}
                                onChangeText={(v) => handleChange("fullname", v)}
                                className="border rounded-lg px-3 py-2 mt-1"
                            />
                        </View>

                        {/* Family Member */}
                        <View className="mb-3">
                            <Text className="text-lg font-semibold">Family Member</Text>
                            <TextInput
                                placeholder="ex. 5.."
                                keyboardType="numeric"
                                value={form.familyMember}
                                onChangeText={(v) => handleChange("familyMember", v)}
                                className="border rounded-lg px-3 py-2 mt-1"
                            />
                        </View>

                        {/* Address */}
                        <View className="mb-3">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold">Address</Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>

                            <View className="ml-3 mt-2">
                                <View className="mb-2">
                                    <View className="flex-row items-center">
                                        <Text className="font-semibold">House No.</Text>
                                        <Text className="text-red-500 ml-1">*</Text>
                                    </View>
                                    <TextInput
                                        placeholder="ex. 0123.."
                                        value={form.houseNo}
                                        onChangeText={(v) => handleChange("houseNo", v)}
                                        className="border rounded-lg px-3 py-2 mt-1"
                                    />
                                </View>

                                <View>
                                    <View className="flex-row items-center">
                                        <Text className="font-semibold">Street/Avenue/Block</Text>
                                        <Text className="text-red-500 ml-1">*</Text>
                                    </View>
                                    <TextInput
                                        placeholder="ex. Rizal St.."
                                        value={form.street}
                                        onChangeText={(v) => handleChange("street", v)}
                                        className="border rounded-lg px-3 py-2 mt-1"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Email */}
                        <View className="mb-3">
                            <Text className="text-lg font-semibold">Email</Text>
                            <TextInput
                                placeholder="ex. janicedelacruz@gmail.com.."
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={form.email}
                                onChangeText={(v) => handleChange("email", v)}
                                className="border rounded-lg px-3 py-2 mt-1"
                            />
                        </View>

                        {/* Contact Number */}
                        <View className="mb-3">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold">Contact Number</Text>
                                <Text className="text-red-500 ml-1">*</Text>
                            </View>
                            <TextInput
                                placeholder="ex. 09123456789.."
                                keyboardType="phone-pad"
                                value={form.contactNumber}
                                onChangeText={(v) => handleChange("contactNumber", v)}
                                className="border rounded-lg px-3 py-2 mt-1"
                            />
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            className="mt-5 bg-green-600 rounded-lg p-3 items-center"
                            activeOpacity={0.8}
                            style={{ opacity: loading ? 0.6 : 1 }}
                        >
                            <Text className="text-white font-semibold">
                                {loading ? "Submitting..." : "Register"}
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}