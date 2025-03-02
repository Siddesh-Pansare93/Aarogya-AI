"use client"

import { useState, useEffect } from "react"
import { View, Text, ActivityIndicator, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Location from "expo-location"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn } from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"

const HospitalBedsScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  interface Hospital {
    _id: number
    "Ward Name": string
    "Type of Hospital/Health facility": string
    "Hospital Name": string
    Location: string
    "Total Bed count": number
    "Available Bed Count": number
  }

  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    requestLocationAndFetchHospitals()
  }, [])

  const requestLocationAndFetchHospitals = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to find nearby hospitals.")
        return
      }

      setLoading(true)
      const loc = await Location.getCurrentPositionAsync({})
      setLocation(loc)
      await fetchHospitals(loc)
    } catch (error) {
      console.error("Error getting location:", error)
      Alert.alert("Error", "Failed to get your location. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchHospitals = async (loc: Location.LocationObject) => {
    try {
      setRefreshing(true)
      const formData = new FormData()
      formData.append(
        "location",
        JSON.stringify({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }),
      )

      // Replace with your backend endpoint URL
      const response = await fetch("http://192.168.34.107.131:5000/find_beds", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched data:", data)

      if (typeof data === "string") {
        setHospitals(JSON.parse(data))
      } else if (Array.isArray(data)) {
        setHospitals(data)
      } else {
        console.error("Unexpected data format", data)
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      Alert.alert("Error", "Failed to fetch hospital beds data.")
    } finally {
      setRefreshing(false)
    }
  }

  const refreshData = () => {
    if (location) {
      fetchHospitals(location)
    } else {
      requestLocationAndFetchHospitals()
    }
  }

  // Demo data
  const mockHospitals = [
    {
      _id: 1,
      "Ward Name": "Central Ward",
      "Type of Hospital/Health facility": "Government",
      "Hospital Name": "City General Hospital",
      Location: "Downtown, City Center",
      "Total Bed count": 250,
      "Available Bed Count": 42,
    },
    {
      _id: 2,
      "Ward Name": "North Wing",
      "Type of Hospital/Health facility": "Private",
      "Hospital Name": "Sunshine Medical Center",
      Location: "North Hills, Uptown",
      "Total Bed count": 180,
      "Available Bed Count": 23,
    },
    {
      _id: 3,
      "Ward Name": "Emergency Ward",
      "Type of Hospital/Health facility": "Municipal",
      "Hospital Name": "Community Health Hospital",
      Location: "Westside, River Road",
      "Total Bed count": 120,
      "Available Bed Count": 8,
    },
  ]

  const displayHospitals = hospitals.length > 0 ? hospitals : mockHospitals

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hospital Bed Availability</Text>
        <Text style={styles.subtitle}>Find available beds near you</Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={refreshData} disabled={loading || refreshing}>
        <Ionicons name="refresh" size={22} color="#fff" />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7F56D9" />
          <Text style={styles.loadingText}>Finding hospitals near you...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {displayHospitals.map((hospital, index) => (
            <Animated.View 
              key={hospital._id || index} 
              entering={FadeIn.duration(500).delay(index * 100)}
              style={styles.cardContainer}
            >
              <LinearGradient
                colors={["#7F56D9", "#FF6B6B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hospitalCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.hospitalName}>{hospital["Hospital Name"]}</Text>
                  <View style={styles.facilityBadge}>
                    <Text style={styles.facilityType}>{hospital["Type of Hospital/Health facility"]}</Text>
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={18} color="#fff" style={styles.icon} />
                    <Text style={styles.hospitalDetails}>{hospital["Location"]}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="medical" size={18} color="#fff" style={styles.icon} />
                    <Text style={styles.hospitalDetails}>Ward: {hospital["Ward Name"]}</Text>
                  </View>
                </View>

                <View style={styles.bedInfoContainer}>
                  <View style={styles.bedInfoItem}>
                    <Text style={styles.bedCount}>{hospital["Total Bed count"]}</Text>
                    <Text style={styles.bedLabel}>Total Beds</Text>
                  </View>

                  <View style={styles.bedInfoDivider} />

                  <View style={styles.bedInfoItem}>
                    <Text style={[styles.bedCount, styles.availableBeds]}>{hospital["Available Bed Count"]}</Text>
                    <Text style={styles.bedLabel}>Available</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#344054",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#667085",
    marginTop: 5,
  },
  refreshButton: {
    position: "absolute",
    top: 25,
    right: 20,
    backgroundColor: "#7F56D9",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#475467",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 20,
  },
  hospitalCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  facilityBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  facilityType: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  hospitalDetails: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
  },
  bedInfoContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  bedInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  bedInfoDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 16,
  },
  bedCount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  availableBeds: {
    color: "#FFD93D",
  },
  bedLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 4,
  },
})

export default HospitalBedsScreen