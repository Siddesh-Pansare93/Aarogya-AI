import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

const DailyIntake = () => {
  const todaysIntakeIngredients = useSelector((state: RootState) => state.user.dailyIntake.ingredients)
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Mock data for demonstration
    const currentIntake = useSelector((state : RootState) => state.user.dailyIntake.nutrients) as Record<string, number>;
    // const currentIntake = 1500 // calories
    // const totalDailyGoal = useSelector((state : RootState) => state.user.diet.nutrients) as Record<string, number>;
    const totalDailyGoal = {
      Calories: 2500,
    } ;
  console.log("Calories" , totalDailyGoal)
  const progressPercentage = (currentIntake.Calories / totalDailyGoal?.Calories) * 100

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{currentDate}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.calorieInfo}>
          <Text style={styles.calorieText}>
            {currentIntake.Calories} / {totalDailyGoal.Calories}
          </Text>
          <Text style={styles.calorieSubtext}>calories consumed</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {todaysIntakeIngredients.map((ingredient, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.cardIcon} />
            <View style={styles.cardContent}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
              <Text style={styles.servingText}>1 serving</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Food</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  calorieInfo: {
    alignItems: "center",
  },
  calorieText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  calorieSubtext: {
    fontSize: 14,
    color: "#757575",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  servingText: {
    fontSize: 14,
    color: "#757575",
  },
  chevron: {
    fontSize: 24,
    color: "#757575",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default DailyIntake

