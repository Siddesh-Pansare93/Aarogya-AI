import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const todaysIntakeIngredients = useSelector((state : RootState) => state.user.dailyIntake.ingredients)
  console.log(todaysIntakeIngredients)
  const handleDailyIntake = () => {
    router.push("/(profileScreens)/dailyIntake");

  };

  const handelePreferenceUpdate = () => {
    router.push("/(boarding)/(tabs)/UserDataform");
  };

  const handleNutritionReport = () => {
    router.push("/(profileScreens)/nutritionReport");
  };

  const handleFavorites = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await signOut();
          router.replace("/signin");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">My Profile</Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="items-center mt-4 mb-8">
          <View className="relative">
            <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K6BNktdElAeW0kBhSc9gJ0YiWPnvbg.png",
              }}
              className="w-24 h-24 rounded-full bg-gray-200"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-lime-400 rounded-full p-1">
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-semibold mt-3">Siddesh Pansare</Text>
          <Text className="text-gray-500">@siddheshreact101</Text>
        </View>

        {/* Menu Items (No Mapping) */}
        <View className="px-4">
          <TouchableOpacity onPress={handleDailyIntake} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <Ionicons name="calendar-outline" size={24} color="#6B7280" />
            </View>
            <Text className="flex-1 ml-4 text-base text-gray-800">Daily Intake</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handelePreferenceUpdate} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <Ionicons name="restaurant-outline" size={24} color="#6B7280" />
            </View>
            <Text className="flex-1 ml-4 text-base text-gray-800">Update Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNutritionReport} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <Ionicons name="document-text-outline" size={24} color="#6B7280" />
            </View>
            <Text className="flex-1 ml-4 text-base text-gray-800">Nutrition Report</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFavorites} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <Ionicons name="heart-outline" size={24} color="#6B7280" />
            </View>
            <Text className="flex-1 ml-4 text-base text-gray-800">Favorites Food</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
              <MaterialIcons name="logout" size={24} color="#6B7280" />
            </View>
            <Text className="flex-1 ml-4 text-base text-gray-800">Log out</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
