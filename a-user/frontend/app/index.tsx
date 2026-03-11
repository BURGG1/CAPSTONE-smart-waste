import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RegisterHousehold from "@/components/RegisterHouseholdModal";

export default function AuthPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleLogin = () => {
    if (form.email === "user" && form.password === "user1234") {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center px-4">
      <View className="w-full max-w-md self-center space-y-6">

        {/* LOGO */}
        <View className="items-center space-y-2 mb-6">
          <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center">
            <Feather name="trash-2" size={32} color="white" />
          </View>

          <Text className="text-xl font-semibold text-center">
            Smart Bin Waste Management
          </Text>

          <Text className="text-gray-500 text-sm text-center">
            Manage waste collection efficiently
          </Text>
        </View>

        {/* CARD */}
        <View className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          <Text className="text-lg font-medium text-center">
            Welcome Back!
          </Text>

          {/* EMAIL */}
          <View>
            <Text className="text-sm mb-1 font-semibold">Email</Text>

            <View className="flex-row items-center mb-4 bg-gray-100 rounded-lg px-3 py-3">
              <Feather name="mail" size={18} color="gray" />

              <TextInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) =>
                  setForm({ ...form, email: text })
                }
                className="flex-1 ml-3"
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="text-sm mb-1 font-semibold">Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3">
              <Feather name="lock" size={18} color="gray" />

              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={form.password}
                onChangeText={(text) =>
                  setForm({ ...form, password: text })
                }
                className="flex-1 ml-3"
              />
            </View>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-green-600 mt-4 mb-4 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              Login
            </Text>
          </TouchableOpacity>

          <Text className="text-sm text-gray-500 text-center">
            Forgot your password?{" "}
            <Text className="text-green-600 font-medium">
              Reset here
            </Text>
          </Text>

          {/* REGISTER BUTTON */}
          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}

          >
            <Text className="text-green-400 text-center font-medium mt-5">
              Register Household
            </Text>
          </TouchableOpacity>

          <RegisterHousehold
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

        </View>
      </View>
    </View>
  );
}