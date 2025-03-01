import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const Home = () => {
  const age = useSelector((state: any) => state.user.userData.age)
  const nutritionalData = useSelector((state: any) => state.user.diet)

  const getNutrientIcon = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case "protein":
        return <FontAwesome5 name="drumstick-bite" size={24} color="#4CAF50" />
      case "carbs":
        return <MaterialCommunityIcons name="bread-slice" size={24} color="#FF9800" />
      case "fat":
        return <FontAwesome5 name="cheese" size={24} color="#FFC107" />
      case "fiber":
        return <MaterialCommunityIcons name="fruit-cherries" size={24} color="#9C27B0" />
      default:
        return <MaterialCommunityIcons name="food-apple" size={24} color="#2196F3" />
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} className="p-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-white">Welcome!</Text>
            {/* <Text className="text-lg text-gray-200">Your Age: {age}</Text> */}
          </View>
          <TouchableOpacity>
            <FontAwesome5 name="user-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Nutritional Summary */}
      <View className="mx-4 my-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          <MaterialCommunityIcons name="food-apple-outline" size={28} color="#4c669f" />
          {" Daily Nutritional Goals"}
        </Text>
        <View className="bg-white rounded-2xl shadow-lg p-4">
          <View className="flex-row flex-wrap justify-between">
            {nutritionalData.nutrients &&
              Object.entries(nutritionalData.nutrients).map(([key, value]) => (
                <View key={key} className="w-[48%] bg-gray-50 rounded-xl p-4 mb-4">
                  {getNutrientIcon(key)}
                  <Text className="text-base font-medium text-gray-600 mt-2">{key}</Text>
                  <Text className="text-xl font-semibold text-gray-800">{value as string} </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      {/* Meal Suggestions */}
      <View className="mx-4 mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          <Ionicons name="restaurant-outline" size={28} color="#4c669f" />
          {" Meal Suggestions"}
        </Text>
        <View className="bg-white rounded-2xl shadow-lg p-4">
          {nutritionalData.mealSuggestions?.map((meal: string, index: number) => (
            <View key={index} className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-lg font-bold text-blue-600">{index + 1}</Text>
              </View>
              <Text className="text-base text-gray-800 flex-1">{meal}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default Home

