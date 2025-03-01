import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { CircularProgress } from "@/components/CircularProgress";
import { NutrientBar } from "@/components/NutrientBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "@/store/store";

const generateWeekDays = () => {
  const today = new Date();
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date,
    });
  }
  return days;
};

const Dashboard = () => {
  const [days, setDays] = useState(generateWeekDays());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const user = useSelector((state : RootState) => state.user.userData);
  const dailyIntake = useSelector((state : RootState) => state.user.dailyIntake.nutrients) as Record<string, number>;
  const dietGoals = useSelector((state : RootState) => state.user.diet.nutrients) as Record<string, number>;

  

  const { name, profilePicture } =  { name: "User", profilePicture: "https://via.placeholder.com/40" };

  // Check if all daily goals are met
  
  
  const allGoalsMet = Object.entries(dietGoals).every(([key, goal]) => {
    const intake = dailyIntake[key];
    console.log(`Checking goal for ${key}: Intake = ${intake}, Goal = ${goal}`);
    return intake !== undefined && intake >= goal;
  });
  
  

  console.log(allGoalsMet)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setDays(generateWeekDays());
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (screen : any) => {
    console.log(`Navigating to ${screen}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: profilePicture || "https://via.placeholder.com/40" }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          />
          <View>
            <Text style={{ fontSize: 14, color: "#666" }}>Welcome</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>{name || "User"}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity onPress={() => handleNavigation("search")}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={{ paddingHorizontal: 20 }}>
        {/* Congratulations Section */}
        {allGoalsMet && (
          <View
            style={{
              backgroundColor: "#DFF6DD",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#388E3C", marginBottom: 8 }}>Congratulations!</Text>
            <Text style={{ fontSize: 16, color: "#4CAF50", textAlign: "center" }}>
              You've completed all your daily nutrient goals! Keep up the great work!
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>Track your diet journey</Text>
          <Image
            source={{ uri: profilePicture || "https://via.placeholder.com/60" }}
            style={{ width: 60, height: 60 }}
          />
        </View>

        <Text style={{ fontSize: 16, color: "#FF9B9B", marginBottom: 16 }}>Today Calories: {dailyIntake.Calories || 0}</Text>

        {/* Nutrient Progress */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
        <View className="gap-y-6">
          <View style={styles.nutrientCard}>
            <CircularProgress percentage={dailyIntake?.Fat || 0} label="Fat" value={`${dailyIntake?.Fat || 0}`} />
          </View>
          <View style={styles.nutrientCard}>
            <CircularProgress percentage={dailyIntake?.Carbohydrate || 0} label="Carbs" value={`${dailyIntake?.Carbohydrate || 0} `} />
          </View>
        </View>

          <View style={{ flex: 1, backgroundColor: "#FFCDD2", borderRadius: 16, padding: 16 }}>
            {Object.entries(dailyIntake).map(([key, value]) => (
              <View key={key}>
                <NutrientBar label={key} value={parseFloat(`${value}`)} maxValue={dietGoals[key]} color="#FFB74D" icon={<Ionicons name="nutrition-outline" size={16} color="#FFB74D" />} />
              </View>
            ))}
          </View>
        </View>

        {/* Date Picker */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.fullDate.toISOString()}
              style={[
                { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: "#F5F5F5", alignItems: "center" },
                selectedDate.getDate() === day.date && selectedDate.getMonth() === day.fullDate.getMonth() && { backgroundColor: "#FF9B9B" }
              ]}
              onPress={() => setSelectedDate(day.fullDate)}
            >
              <Text
                style={[
                  { fontSize: 14, color: "#666" },
                  selectedDate.getDate() === day.date && selectedDate.getMonth() === day.fullDate.getMonth() && { color: "#fff" }

                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  { fontSize: 16, fontWeight: "600", color: "#333" },
                  selectedDate.getDate() === day.date && selectedDate.getMonth() === day.fullDate.getMonth() && { color: "#fff" },
                ]}
              >
                {day.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Insights Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: "#333", marginBottom: 16 }}>Daily Insights</Text>
          {[
            { title: "Add Breakfast", icon: "sunny-outline", color: "#FFB74D" },
            { title: "Add Lunch", icon: "restaurant-outline", color: "#4CAF50" },
            { title: "Add Dinner", icon: "moon-outline", color: "#3F51B5" },
          ].map((insight, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => handleNavigation(insight.title.toLowerCase().replace(" ", "-"))}
            >
              <View
                style={{
                  backgroundColor: insight.color,
                  borderRadius: 50,
                  padding: 12,
                  marginRight: 16,
                }}
              >
                <Ionicons name={insight.icon as keyof typeof Ionicons.glyphMap} size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 4 }}>{insight.title}</Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  Track your {insight.title.toLowerCase()} for better insights
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  nutrientCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Dashboard;
