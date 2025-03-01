import React from "react"
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface FoodDrawerProps {
  isVisible: boolean
  description: string
  onConsume: () => void
}

export const FoodDrawer = ({ isVisible, description, onConsume }: FoodDrawerProps) => {
  if (!isVisible) return null

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-6">
      <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

      <View className="flex-row items-center mb-4">
        <Ionicons name="barcode-outline" size={24} color="#4B5563" />
        <Text className="text-gray-800 text-lg ml-2 flex-1">{description}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onConsume} className="bg-green-500 p-4 rounded-xl mt-4">
        <Text className="text-white text-center font-semibold">Will you consume? Press Enter to confirm</Text>
      </TouchableOpacity>
    </View>
  )
}

