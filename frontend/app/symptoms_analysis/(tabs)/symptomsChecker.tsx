import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

import { useSelector } from "react-redux";
import { setNutrients, resetNutrients, addIngredient } from "../../../store/features/dailyIntakeSlice";
import { AppDispatch, RootState } from "../../../store/store";

const severityColors: { [key: string]: [string, string] } = {
  low: ['#4CAF50', '#8BC34A'],
  medium: ['#FFC107', '#FFB300'],
  high: ['#FF5722', '#F44336'],
};

export default function SymptomCheckerScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    diagnosis: string;
    severity: 'low' | 'medium' | 'high' | string;
    recommendations: string[] | string;
    doctors?: any; // can be either string or array
  }>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const ingredientsFromState = useSelector(
    (state: RootState) => state.user.dailyIntake.ingredients
  );
  const userData = useSelector((state: RootState) => state.user.userData);

  // Get user location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to send your location with the request.');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "You need to grant microphone access.");
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        sendAudioToBackend(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const sendAudioToBackend = async (uri: string) => {
    try {
      const fileType = uri.split(".").pop();
      const formData = new FormData();
      formData.append("audio", {
        uri,
        type: `audio/${fileType}`,
        name: `voice_query.${fileType}`,
      } as any);
      formData.append("user_Details", JSON.stringify(userData));
      formData.append("ingredients", JSON.stringify(ingredientsFromState));

      // Get user location and append to formData
      const location = await getUserLocation();
      if (location) {
        formData.append(
          "location",
          JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
        );
      }

      setLoading(true);
      console.log("Sending formData:", formData);
      const response = await fetch(`http://192.168.34.127/analyze_symptoms`, {
        method: "POST",
        body: formData,
      });
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      const responseData = await response.json();
      setResult(responseData);
      console.log(responseData);
    } catch (error) {
      console.error("Failed to send audio:", error);
      Alert.alert("Error", "Failed to send audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      // Get user location before making the API request
      const location = await getUserLocation();
      const payload = {
        symptoms,
        location: location
          ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
          : null,
      };
      const response = await fetch("http://192.168.34.127:5000/check_symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Server error");
      }
      const data = await response.json();
      console.log("Symptom check response:", data);
      setResult(data);
    } catch (error) {
      console.error("Error checking symptoms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely parse doctors if it's a JSON string
  const getDoctorData = () => {
    if (!result || !result.doctors) return null;
    if (typeof result.doctors === 'string') {
      try {
        return JSON.parse(result.doctors);
      } catch (error) {
        console.error("Failed to parse doctors string:", error);
        return null;
      }
    }
    return result.doctors;
  };

  const doctorsData = getDoctorData();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} className="pt-5 pb-7 px-5 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white mb-1">Symptom Checker</Text>
        <Text className="text-sm text-white opacity-80">Describe your symptoms or use voice input</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 mt-[-20px]" contentContainerStyle={{ paddingBottom: 30 }}>
        <Animated.View entering={FadeInDown.delay(300).duration(600)} className="bg-white rounded-2xl p-4 shadow-lg">
          <TextInput
            className="min-h-[100px] text-base text-gray-800"
            placeholder="Describe your symptoms..."
            placeholderTextColor="#999"
            multiline
            value={symptoms}
            onChangeText={setSymptoms}
          />
          <View className="flex-row justify-end items-center mt-2">
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-2"
            >
              <Icon name={recording ? "stop" : "microphone"} size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-10 h-10 rounded-full ${!symptoms.trim() ? 'bg-gray-400' : 'bg-blue-600'} justify-center items-center`}
              onPress={handleCheck}
              disabled={!symptoms.trim() || loading}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : <Icon name="send" size={20} color="white" />}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {result && (
          <Animated.View entering={FadeIn.duration(800)} className="mt-5 bg-gray-100 p-6 border-2 border-gray-400 rounded-lg shadow-xl">
            <Text className="text-2xl font-bold text-black mb-2">Diagnosis</Text>
            <Text className="text-xl text-black">{result.diagnosis}</Text>

            <View className="my-4">
              <Text className="text-2xl font-bold text-black mb-2">Severity</Text>
              <Text className={`text-xl font-semibold ${
                result.severity === 'low'
                  ? 'text-green-600'
                  : result.severity === 'medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {result.severity.toUpperCase()}
              </Text>
            </View>

            <View className="my-4">
              <Text className="text-2xl font-bold text-black mb-2">Recommendations</Text>
              {Array.isArray(result.recommendations) ? (
                result.recommendations.map((rec, index) => (
                  <Text key={index} className="text-xl text-black">• {rec}</Text>
                ))
              ) : (
                <Text className="text-xl text-black">{result.recommendations}</Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Render doctor cards if available */}
        {doctorsData && Array.isArray(doctorsData) && (
          <Animated.View entering={FadeIn.duration(800)} className="mt-5">
            <Text className="text-2xl font-bold text-black mb-3">Recommended Doctors</Text>
            {doctorsData.map((doc: any, index: number) => (
              <View key={index} className="bg-white p-4 border border-gray-300 rounded-lg mb-4 shadow-md">
                <Text className="text-xl font-bold text-black">{doc["Doctor Name"]}</Text>
                <Text className="mt-1 text-base text-gray-700">Specialization: {doc["Specialization"]}</Text>
                <Text className="mt-1 text-base text-gray-700">Experience: {doc["Experience"]}</Text>
                <Text className="mt-1 text-base text-gray-700">
                  Location: {doc["Location"]} {doc["City"]}
                </Text>
                <Text className="mt-1 text-base text-gray-700">Hospital: {doc["Hospital"]}</Text>
                <Text className="mt-1 text-base text-gray-700">Consultation Fee: {doc["Consultation Fee"]}</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(doc["Profile Link"])}
                  className="mt-3 bg-blue-600 p-2 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">Book Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
