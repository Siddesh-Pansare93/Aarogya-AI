import React, { useEffect, useRef } from "react"
import { View, Animated, Dimensions } from "react-native"

export const ScanningAnimation = () => {
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Create scanning line animation
    const scanningAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 300,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    )

    // Create pulsing effect
    const pulsingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    // Create opacity animation for the overlay
    const overlayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    // Start all animations
    scanningAnimation.start()
    pulsingAnimation.start()
    overlayAnimation.start()

    return () => {
      scanningAnimation.stop()
      pulsingAnimation.stop()
      overlayAnimation.stop()
    }
  }, [])

  return (
    <View className="absolute inset-0">
      {/* Scanning overlay */}
      <Animated.View className="absolute inset-0 bg-green-500" style={{ opacity }} />

      {/* Scanning line */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{
          transform: [{ translateY }],
        }}
      >
        <View className="h-[2px] bg-white shadow-lg">
          <View className="absolute top-0 left-0 right-0 h-[2px] bg-green-400 blur-sm" />
        </View>
      </Animated.View>

      {/* Corner markers */}
      <View className="absolute inset-0 border-2 border-transparent">
        <Animated.View style={{ transform: [{ scale }] }} className="w-full h-full">
          <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500" />
          <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500" />
          <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500" />
          <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500" />
        </Animated.View>
      </View>
    </View>
  )
}

