import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"; // Expo icons


// household information
const household = {
  id: "HH-202610001",
  name: "Joel Dela Cruz",
  address: "0543, Rizal Street",
  contact: "+63 917 123 4567",
  members: 5,
  email: "joelpogidelacruz@gmail.com",
  registeredSince: "January 15, 2026",
  totalDisposals: 48,
  compliance: "Excellent",
  points: { total: 1240, thisMonth: 280 },
};

// for household information to
const infoItems = [
  { label: "Household Name", value: household.name, icon: "home" },
  { label: "Address", value: household.address, icon: "map-pin" },
  { label: "Contact Number", value: household.contact, icon: "phone" },
  { label: "Members", value: `${household.members} people`, icon: "users" },
  { label: "Registered Since", value: household.registeredSince, icon: "calendar" },
  { label: "Email", value: household.email, icon: "mail" },
];

export default function Profile() {
  const [operEditModal, setEditModal] = useState(false);

  return (

        <ScrollView className="flex-1 px-4 py-6 space-y-6 mt-5 mb-5">
          {/* Page Header */}
          <View>
            <Text className="text-3xl font-bold">Household Profile</Text>
            <Text className="text-gray-500 mb-6">
              View and manage your household information
            </Text>
          </View>

          {/* Household Information */}
          <View className="bg-white rounded-xl shadow p-6 space-y-4">
            <Text className="text-lg font-semibold mb-4">Household Information</Text>
            <View className="flex flex-col md:flex-row flex-wrap gap-4">
              {infoItems.map((item) => (
                <View key={item.label} className="flex-row items-center gap-4 bg-gray-50 rounded-xl p-4 flex-1">
                  <View className="p-3 bg-green-100 rounded-lg">
                    {/* Map icon string to Expo Icon */}
                    {item.icon === "home" && <Feather name="home" size={20} color="#16A34A" />}
                    {item.icon === "map-pin" && <Feather name="map-pin" size={20} color="#16A34A" />}
                    {item.icon === "phone" && <Feather name="phone" size={20} color="#16A34A" />}
                    {item.icon === "users" && <Feather name="users" size={20} color="#16A34A" />}
                    {item.icon === "calendar" && <Feather name="calendar" size={20} color="#16A34A" />}
                    {item.icon === "mail" && <Feather name="mail" size={20} color="#16A34A" />}
                  </View>
                  <View>
                    <Text className="text-sm text-gray-500">{item.label}</Text>
                    <Text className="font-semibold">{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Update Button */}
          <View className="flex items-center mt-4">
            <TouchableOpacity onPress={() => setEditModal(true)}>
              <Text className="text-gray-400 underline">Update information</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Household Modal */}
          {/* <EditHousehold isOpen={operEditModal} onClose={() => setEditModal(false)} /> */}

          {/* Waste Segregation Statistics (Optional, uncomment if needed) */}
          {/*
          <View className="bg-white rounded-xl shadow p-6 space-y-4 mt-6">
            <Text className="text-lg font-semibold mb-4">Waste Segregation Statistics</Text>
            {wasteStats.map((stat) => (
              <View key={stat.type} className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-semibold">{stat.type}</Text>
                  <Text className={`text-2xl font-bold text-${stat.color}-500`}>{stat.count}</Text>
                </View>
                <Text className="text-sm text-gray-500 mb-2">Points Earned</Text>
                <Text className={`font-semibold text-${stat.color}-500 mb-3`}>+{stat.points}</Text>
                <View className="w-full bg-gray-200 h-2 rounded-full">
                  <View className={`h-2 rounded-full bg-${stat.color}-500`} style={{ width: `${stat.percent}%` }} />
                </View>
                <Text className="text-xs text-gray-500 mt-2">{stat.percent}% of total disposals</Text>
              </View>
            ))}
          </View>
          */}
        </ScrollView>
  
  );
}