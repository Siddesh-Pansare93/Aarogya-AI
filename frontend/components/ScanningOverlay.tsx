import React from "react"
import { View, Animated } from "react-native"
import { useEffect, useRef } from "react"

export const ScanningOverlay = () => {
  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 300, // Adjust based on your image height
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate())
    }

    animate()
  }, [])

  return (
    <View className="absolute inset-0 overflow-hidden">
      <Animated.View
        className="w-full h-1 bg-green-500 opacity-50"
        style={{
          transform: [{ translateY }],
        }}
      />
    </View>
  )
}

