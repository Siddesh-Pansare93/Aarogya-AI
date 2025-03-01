import React from "react"
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface FoodAnalysisDrawerProps {
  isVisible: boolean
  isAnalyzing: boolean
  foodData: {
    name: string
    description: string
    nutritionalInfo?: string
  } | null
  onConsume: () => void
}

export const FoodAnalysisDrawer = ({ isVisible, isAnalyzing, foodData, onConsume }: FoodAnalysisDrawerProps) => {
  if (!isVisible) return null

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
      <View className="p-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {isAnalyzing ? (
          <View className="py-4">
            <View className="flex-row items-center justify-center space-x-2">
              <ActivityIndicator size="small" color="#10B981" />
              <Text className="text-gray-600 text-lg">Analyzing your food...</Text>
            </View>
          </View>
        ) : foodData ? (
          <>
            <View className="flex-row items-center mb-4">
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">{foodData.name}</Text>
                <Text className="text-gray-600 mt-1">{foodData.description}</Text>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="information-circle-outline" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {foodData.nutritionalInfo && (
              <View className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="text-gray-600">{foodData.nutritionalInfo}</Text>
              </View>
            )}

            <TouchableOpacity onPress={onConsume} className="bg-green-500 p-4 rounded-xl mt-2">
              <Text className="text-white text-center font-semibold">Will you consume? Press Enter to confirm</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="py-4">
            <Text className="text-red-500 text-center">Could not analyze the image. Please try again.</Text>
          </View>
        )}
      </View>
    </View>
  )
}

