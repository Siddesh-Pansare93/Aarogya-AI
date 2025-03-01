import React from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

const screenWidth = Dimensions.get("window").width
const chartWidth = screenWidth - 70 // Reduced width to account for padding

const NutritionReportScreen = () => {
  const nutrients = useSelector((state: RootState) => state.user.dailyIntake.nutrients)

  // Prepare data for charts
  const nutrientLabels = Object.keys(nutrients)
  const nutrientValues = Object.values(nutrients).map((value) => Number.parseInt(value.toString()))

  // Function to shorten labels
  const shortenLabel = (label: string) => label.substring(0, 3)

  const progressData = {
    labels: nutrientLabels.map(shortenLabel),
    data: nutrientValues.map((val) => Math.min(val / 100, 1)), // Ensure values don't exceed 1
  }

  const lineChartData = {
    labels: nutrientLabels.map(shortenLabel),
    datasets: [
      {
        data: nutrientValues,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Purple color
        strokeWidth: 2,
      },
    ],
  }

  const barChartData = {
    labels: nutrientLabels.map(shortenLabel),
    datasets: [
      {
        data: nutrientValues,
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
      rotation: 0,
    },
    propsForVerticalLabels: {
      fontSize: 8,
    },
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nutrition Report</Text>

      {/* Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Nutrient Values</Text>
        <LineChart
          data={lineChartData}
          width={chartWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      </View>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Nutrient Comparison</Text>
        <BarChart
          data={barChartData}
          width={chartWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          withInnerLines={false}
        />
      </View>

      {/* Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Overview</Text>
        <ProgressChart
          data={progressData}
          width={chartWidth}
          height={220}
          strokeWidth={6}
          radius={10}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
          }}
          style={styles.chart}
          hideLegend={false}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})

export default NutritionReportScreen

