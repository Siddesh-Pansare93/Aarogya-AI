import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ScanningAnimation } from "./ScanningAnimation"; // Ensure this component is implemented
import { useSelector, useDispatch } from "react-redux";
import { setNutrients, resetNutrients, addIngredient } from "../store/features/dailyIntakeSlice"; // Update import
import { AppDispatch, RootState } from "../store/store"; // Make sure to import these from store

// Define the type for food data
interface FoodData {
  feedback?: string;
  ingredients?: string[];
  nutritional_facts?: string;
  final_thoughts?: string;
}

// Initialize the recentScans array with FoodData type
const recentScans: FoodData[] = [];

const ImageScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [foodData, setFoodData] = useState<FoodData>({});
  const dispatch = useDispatch();
  const ingredientsFromState = useSelector(
    (state: RootState) => state.user.dailyIntake.ingredients
  );
  const userData = useSelector((state: RootState) => state.user.userData);

  // Image picker logic
  const pickImage = async (source: string) => {
    const permissionResult =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", `You need to grant ${source} access to use this feature.`);
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Analyze food image
  const analyzeFoodImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please provide both an image ");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert the URI to a Blob
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const fileBlob = {
        uri: image,
        type: `image/${fileType}`,
        name: `food_image.${fileType}`,
      };

      const formData = new FormData();
      formData.append("image", fileBlob as any);
      formData.append("description", description || "");
      formData.append("user_Details", JSON.stringify(userData));

      const response = await fetch("http://192.168.107.131:5000/scan_img", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json(); // Parse the JSON response
      console.log(data);

      if (data) {
        setFoodData(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Dispatch nutrients and ingredients to store
  const dispatch_NutrientsAndIngredientsToStore = () => {
    if (foodData.nutritional_facts) {
      const parsedNutritionalFacts = JSON.parse(foodData.nutritional_facts);

      // Dispatch the nutrients
      dispatch(setNutrients(parsedNutritionalFacts));

      if (foodData.ingredients && Array.isArray(foodData.ingredients)) {
        foodData.ingredients.forEach((ingredient: string) => {
          if (!ingredientsFromState.includes(ingredient)) {
            dispatch(addIngredient(ingredient));
          }
        });
      }
    }

    // Push food data to recentScans and reset foodData
    setTimeout(() => {
      recentScans.push(foodData);
      setFoodData({});
      console.log(recentScans);
    }, 5000);
  };

  const resetAll = () => {
    setImage(null);
    setDescription("");
    recentScans.push(foodData);
    setFoodData({});
  };

  const handleSelectScan = (scan: FoodData): void => {
    // You can either display more details in a modal or update state
    Alert.alert("Scan Selected", `You selected scan with feedback: ${scan.feedback || "No Feedback"}`);
    // Alternatively, you could navigate to a different screen or update another part of the UI
    // Example: navigation.navigate("ScanDetails", { scan });
  };
  

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 ml-4">Image Scanner</Text>
        <TouchableOpacity className="ml-auto">
          <Ionicons name="ellipsis-horizontal" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 p-4">
        {image ? (
          <ScrollView className="flex-1">
            <View className="rounded-xl overflow-hidden shadow-md bg-white mb-4">
              <Image source={{ uri: image }} className="w-full h-64" resizeMode="cover" />
              {isAnalyzing && <ScanningAnimation />}
            </View>
            <TextInput
              placeholder="Enter description (OPTIONAL)"
              value={description}
              onChangeText={setDescription}
              className="border border-gray-300 p-3 rounded-lg mt-4"
            />
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className={`flex-1 py-3 px-6 rounded-lg ${isAnalyzing ? "bg-gray-400" : "bg-green-500"}`}
                onPress={analyzeFoodImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text className="text-white font-medium text-center">Analyze</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 px-6 bg-red-500 rounded-lg ml-4"
                onPress={resetAll}
              >
                <Text className="text-white font-medium text-center">Reset</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-row justify-evenly mt-12">
            <TouchableOpacity
              className="bg-green-500 py-3 px-6 rounded-lg"
              onPress={() => pickImage("gallery")}
            >
              <Text className="text-white font-medium">Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg"
              onPress={() => pickImage("camera")}
            >
              <Text className="text-white font-medium">Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Display Meal Data */}
        <ScrollView>
          {recentScans.map((scan: FoodData, index) => (
            <Pressable key={index} onPress={() => handleSelectScan(scan)}>
              <View className="p-4 bg-white shadow-md mb-4 rounded-lg">
                <Text className="font-semibold text-lg text-gray-800">Scan {index + 1}</Text>
                <Text className="text-gray-600">{scan.feedback || "No Feedback"}</Text>
              </View>
            </Pressable>
          ))}

          {foodData && foodData.ingredients && (
            <View className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-800">Ingredients:</Text>
              <Text className="text-gray-600 mt-2">{foodData.ingredients.join(", ")}</Text>
            </View>
          )}

          {foodData && foodData.nutritional_facts && (
            <View className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-800">Nutritional Facts:</Text>
              {/* Render each nutritional fact key-value pair */}
              {Object.entries(JSON.parse(foodData.nutritional_facts)).map(([key, value]) => (
                <Text key={key} className="text-gray-600 mt-2">
                  {key}: {String(value)}
                </Text>
              ))}
            </View>
          )}

          {foodData && foodData.feedback && (
            <View className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-800">Feedback:</Text>
              <Text className="text-gray-600 mt-2">{foodData.feedback}</Text>
            </View>
          )}

          {foodData && foodData.final_thoughts && (
            <View className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <Text className="text-lg font-bold text-gray-800">Final Thoughts:</Text>
              <Text className="text-gray-600 mt-2">{foodData.final_thoughts}</Text>
            </View>
          )}
        </ScrollView>

        {foodData.nutritional_facts && (
          <View className="w-full h-[120px] flex justify-center items-center bg-white shadow-md rounded-lg mt-6">
            <Text className="text-2xl font-extrabold text-gray-900 mb-4">Had You Eaten This?</Text>
            <View className="flex flex-row justify-evenly w-full gap-x-6">
              <Pressable
                onPress={dispatch_NutrientsAndIngredientsToStore}
                className="px-6 py-3 rounded-full bg-green-600 bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform hover:scale-105 active:scale-95"
              >
                <Text className="text-white text-xl font-bold">Yes!</Text>
              </Pressable>
              <Pressable
                onPress={resetAll}
                className="px-6 py-3 rounded-full bg-red-600 bg-gradient-to-r from-red-400 to-red-600 shadow-lg transform hover:scale-105 active:scale-95"
              >
                <Text className="text-white text-xl font-bold">No</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ImageScanner;
