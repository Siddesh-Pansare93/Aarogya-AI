import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface NutrientBarProps {
  label: string
  value: number
  maxValue: number
  color: string
  icon: React.ReactNode
}

export const NutrientBar = ({ label, value, maxValue, color, icon }: NutrientBarProps) => {
  const progress = (value / maxValue) * 100

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}g</Text>
      </View>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
})

