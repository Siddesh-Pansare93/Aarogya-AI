import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ImageScanner from "@/components/ImageScanner"

const Scanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageSelection = (image: string) => {
    setSelectedImage(image)
  }

  const resetSelection = () => {
    setSelectedImage(null)
    Alert.alert("Selection Cleared", "You can now select a new image.")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Scanner</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Instructions Section */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            Use the scanner below to capture a food item or upload an image from your gallery. Get detailed nutritional
            information instantly!
          </Text>
        </View>

        {/* Scanner Component */}
        <View style={styles.scannerContainer}>
          <ImageScanner />
        </View>

        {/* Additional Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="pencil" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Manual Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="time" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Recent Scans</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  instructions: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  scannerContainer: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#4a4a4a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
})

export default Scanner

