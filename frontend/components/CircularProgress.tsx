import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface CircularProgressProps {
  percentage: number
  label: string
  value: string
  color?: string
}

export const CircularProgress = ({ percentage, label, value, color = "#FFB74D" }: CircularProgressProps) => {
  const radius = 35
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (percentage / 100) * circumference

  return (
    <View style={styles.container}>
      <Svg width={100} height={100} style={styles.svg}>
        <Circle cx={50} cy={50} r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={50}
          cy={50}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
})

