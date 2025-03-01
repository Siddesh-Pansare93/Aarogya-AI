import React, { useState, useRef } from "react";
import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { persistor } from "@/store/store";

const StoreScreen = () => {
  const store = useSelector((state: any) => state.user.dailyIntake);
  console.log("daily Intake:", store);

  const dispatch = useDispatch();
  const router = useRouter();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null); // State for server response
  const [loading, setLoading] = useState(false); // State for loading indicator
  const soundRef = useRef<Audio.Sound | null>(null);

  // Start Recording
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
      console.log("Recording started...");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Stop Recording and Upload
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setAudioUri(uri);
      console.log("Recording stopped, file saved at:", uri);

      if (uri) {
        sendAudioToBackend(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  // Send Recorded Audio to Backend
  const sendAudioToBackend = async (uri: string) => {
    try {
      const fileType = uri.split(".").pop();
      const formData = new FormData();
      formData.append("audio", {
        uri,
        type: `audio/${fileType}`,
        name: `voice_query.${fileType}`,
      } as any);

      setLoading(true); // Start loading
      console.log("Sending audio to server..." ,);
      const response = await fetch(`http://192.168.34.127:5000/upload_audio`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const responseData = await response.json(); // Expecting JSON response from backend

      // Extract the message from the response and update state
      const { message } = responseData;
      console.log("Server Response:", message);
      setServerResponse(message); // Set server response to display in the UI

    } catch (error) {
      console.error("Failed to send audio:", error);
      Alert.alert("Error", "Failed to send audio. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Reset Store
  const handleStoreReset = async () => {
    console.log("Resetting store...");
    dispatch({ type: "RESET_STORE" });
    persistor.purge();
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-xl font-bold mb-4">Voice Chat</Text>

      <Pressable
        onPress={recording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full ${recording ? "bg-red-500" : "bg-blue-500"} shadow-lg transform active:scale-95`}
      >
        <Text className="text-white text-lg">{recording ? "Stop Recording" : "Speak"}</Text>
      </Pressable>

      {/* {audioUri && (
        <Text className="mt-4 text-gray-700">Recorded: {audioUri.split("/").pop()}</Text>
      )} */}

      <ScrollView className="flex-1 w-full mt-6">
        {loading && (
          <View className="flex-row items-center justify-center mb-4">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="ml-4 text-gray-600">{ process.env.PYTHONURL}</Text>
          </View>
        )}

        {serverResponse && (
          <View className="p-4 bg-white rounded-lg shadow-lg">
            <Text className="text-lg font-semibold text-gray-800"> Response:</Text>
            <Text className="text-gray-600 mt-2">{serverResponse}</Text>
          </View>
        )}
      </ScrollView>

      {/* <Pressable
        onPress={handleStoreReset}
        className="mt-6 px-6 py-3 rounded-full bg-gray-800 shadow-lg active:scale-95"
      >
        <Text className="text-white text-lg">Reset Store</Text>
      </Pressable> */}
    </View>
  );
};

export default StoreScreen;
