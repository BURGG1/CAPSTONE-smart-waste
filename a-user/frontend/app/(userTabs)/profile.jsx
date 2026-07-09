import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
    const router = useRouter();
    const [household, setHousehold] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        fullname: "",
        contactNumber: "",
        houseNo: "",
        street: "",
        familyMember: "",
        email: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const fetchHousehold = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userStr = await AsyncStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user?.id) return;

            const res = await fetch(`http://192.168.0.103:5000/api/households/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setHousehold(data.data);
                setForm({
                    fullname: data.data.fullname || "",
                    contactNumber: data.data.contactNumber || "",
                    houseNo: data.data.address?.houseNo || "",
                    street: data.data.address?.street || "",
                    familyMember: data.data.familyMember?.toString() || "",
                    email: data.data.email || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch household:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHousehold();
    }, []);

    const handleUpdate = async () => {
        // Validate password fields if any are filled
        if (passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword) {
            if (!passwordForm.currentPassword) {
                Alert.alert("Error", "Please enter your current password.");
                return;
            }
            if (!passwordForm.newPassword) {
                Alert.alert("Error", "Please enter a new password.");
                return;
            }
            if (passwordForm.newPassword.length < 6) {
                Alert.alert("Error", "New password must be at least 6 characters.");
                return;
            }
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                Alert.alert("Error", "New passwords do not match.");
                return;
            }
        }

        setUpdating(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const userStr = await AsyncStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;

            const body = {
                fullname: form.fullname,
                contactNumber: form.contactNumber,
                address: {
                    houseNo: form.houseNo,
                    street: form.street,
                },
                familyMember: form.familyMember ? parseInt(form.familyMember) : null,
                email: form.email,
            };

            // Only include password fields if user wants to change it
            if (passwordForm.currentPassword && passwordForm.newPassword) {
                body.currentPassword = passwordForm.currentPassword;
                body.newPassword = passwordForm.newPassword;
            }

            const res = await fetch(`http://localhost:5000/api/households/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                Alert.alert("Error", data.message || "Failed to update.");
                return;
            }

            Alert.alert("Success", "Profile updated successfully!");
            setIsModalOpen(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            fetchHousehold();
        } catch (err) {
            Alert.alert("Error", "Cannot connect to server.");
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/");
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#16A34A" />
            </SafeAreaView>
        );
    }

    const infoItems = [
        { label: "Household Name", value: household?.fullname || "—", icon: "home" },
        { label: "Address", value: [household?.address?.houseNo, household?.address?.street].filter(Boolean).join(", ") || "—", icon: "map-pin" },
        { label: "Contact Number", value: household?.contactNumber ? `+63 ${household.contactNumber}` : "—", icon: "phone" },
        { label: "Members", value: household?.familyMember ? `${household.familyMember} people` : "—", icon: "users" },
        { label: "Email", value: household?.email || "—", icon: "mail" },
    ];

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1 px-4 py-1">

                <View>
                    <Text className="text-3xl font-bold">Household Profile</Text>
                    <Text className="text-gray-500 mb-6">View and manage your household information</Text>
                </View>

                <View className="bg-white rounded-xl shadow p-6 space-y-4">
                    <Text className="text-lg font-semibold mb-4">Household Information</Text>
                    <View className="flex flex-col gap-4">
                        {infoItems.map((item) => (
                            <View key={item.label} className="w-full flex-row items-center gap-4 bg-gray-50 rounded-xl p-4">
                                <View className="p-3 bg-green-100 rounded-lg">
                                    <Feather name={item.icon} size={20} color="#16A34A" />
                                </View>
                                <View>
                                    <Text className="text-sm text-gray-500">{item.label}</Text>
                                    <Text className="font-semibold">{item.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View className="flex items-center mt-4">
                        <TouchableOpacity onPress={() => setIsModalOpen(true)}>
                            <Text className="text-gray-400 underline">Update information</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="w-full items-center mt-4 mb-4">
                    <TouchableOpacity onPress={handleLogout} className="bg-gray-600 px-4 py-2 rounded-lg">
                        <View className="flex-row items-center gap-2">
                            <Feather name="log-out" size={18} color="white" />
                            <Text className="text-white">Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={isModalOpen} animationType="slide" transparent>
                <View className="flex-1 bg-black/40 justify-center items-center p-4">
                    <ScrollView className="w-full" contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                        <View className="bg-white w-full rounded-2xl p-6 gap-4">

                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-bold">Update Information</Text>
                                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                                    <Feather name="x" size={22} color="gray" />
                                </TouchableOpacity>
                            </View>

                            {/* Info Fields */}
                            {[
                                { label: "Fullname", key: "fullname", placeholder: "ex. Joel Dela Cruz" },
                                { label: "Contact Number", key: "contactNumber", placeholder: "ex. 9171234567", keyboard: "phone-pad" },
                                { label: "House No.", key: "houseNo", placeholder: "ex. 0123" },
                                { label: "Street / Block", key: "street", placeholder: "ex. Rizal St." },
                                { label: "Family Members", key: "familyMember", placeholder: "ex. 5", keyboard: "numeric" },
                                { label: "Email", key: "email", placeholder: "ex. joel@email.com", keyboard: "email-address" },
                            ].map((field) => (
                                <View key={field.key}>
                                    <Text className="text-sm font-semibold mb-1">{field.label}</Text>
                                    <TextInput
                                        value={form[field.key]}
                                        onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                                        placeholder={field.placeholder}
                                        keyboardType={field.keyboard || "default"}
                                        className="border rounded-lg px-3 py-2"
                                    />
                                </View>
                            ))}

                            {/* Divider */}
                            <View className="border-t border-gray-200 mt-2 pt-4">
                                <Text className="text-sm font-bold text-gray-700 mb-3">
                                    Change Password
                                </Text>
                                <Text className="text-xs text-gray-400 mb-3">
                                    Leave blank if you don't want to change your password.
                                </Text>

                                {/* Current Password */}
                                <View className="mb-3">
                                    <Text className="text-sm font-semibold mb-1">Current Password</Text>
                                    <View className="flex-row items-center border rounded-lg px-3 py-2">
                                        <TextInput
                                            value={passwordForm.currentPassword}
                                            onChangeText={(v) => setPasswordForm((prev) => ({ ...prev, currentPassword: v }))}
                                            placeholder="Enter current password"
                                            secureTextEntry={!showCurrentPassword}
                                            className="flex-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                                            <Feather name={showCurrentPassword ? "eye-off" : "eye"} size={18} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View className="mb-3">
                                    <Text className="text-sm font-semibold mb-1">New Password</Text>
                                    <View className="flex-row items-center border rounded-lg px-3 py-2">
                                        <TextInput
                                            value={passwordForm.newPassword}
                                            onChangeText={(v) => setPasswordForm((prev) => ({ ...prev, newPassword: v }))}
                                            placeholder="Enter new password"
                                            secureTextEntry={!showNewPassword}
                                            className="flex-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                            <Feather name={showNewPassword ? "eye-off" : "eye"} size={18} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirm New Password */}
                                <View className="mb-3">
                                    <Text className="text-sm font-semibold mb-1">Confirm New Password</Text>
                                    <View className="flex-row items-center border rounded-lg px-3 py-2">
                                        <TextInput
                                            value={passwordForm.confirmPassword}
                                            onChangeText={(v) => setPasswordForm((prev) => ({ ...prev, confirmPassword: v }))}
                                            placeholder="Re-enter new password"
                                            secureTextEntry={!showConfirmPassword}
                                            className="flex-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleUpdate}
                                disabled={updating}
                                className="bg-green-600 py-3 rounded-lg items-center mt-2"
                                style={{ opacity: updating ? 0.6 : 1 }}
                            >
                                <Text className="text-white font-semibold">
                                    {updating ? "Updating..." : "Save Changes"}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>
            </Modal>

        </SafeAreaView>
    );
}