import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/store/features/userDataSlice';
import api, { generateDiet } from '@/api';
import { setNutritionalData } from '@/store/features/userDietSlice';

const UserDetailsForm = () => {

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    medicalHistory: '',
    goals: '',
    activityLevel: '',
    dietaryPreferences: '',
    allergies: '',
    currentEatingHabits: '',
   
  });

  const genderOptions = ['Male', 'Female', 'Other'];
  const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
  const dietaryPreferences = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Paleo', 'None'];

  interface FormData {
    age: string;
    weight: string;
    height: string;
    gender: string;
    medicalHistory: string;
    goals: string;
    activityLevel: string;
    dietaryPreferences: string;
    allergies: string;
    currentEatingHabits: string;
  }

  interface HandleInputChange {
    (key: keyof FormData, value: string): void;
  }

  const handleInputChange: HandleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // alert(`User Data: ${JSON.stringify(formData, null, 2)}`);
    const dietData = await generateDiet(formData)
    console.log('DietData : ',dietData)
    dispatch(setUserDetails(formData));
    dispatch(setNutritionalData(dietData))
    setTimeout(() => {
      // Now that the state is updated, navigate to home
      router.push('/(root)/(tabs)/home');
    }, 3000)
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pb-10 ">
      <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mt-4 mb-6">
        Personalize Your Diet Plan
      </Text>

      {/* Age Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Age
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Enter your age"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
        />
      </View>

      {/* Weight Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Weight (kg)
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Enter your weight"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(text) => handleInputChange('weight', text)}
        />
      </View>

      {/* Height Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Height (cm)
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Enter your height"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) => handleInputChange('height', text)}
        />
      </View>

      {/* Gender Selector */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender
        </Text>
        <View className="flex-row flex-wrap">
          {genderOptions.map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                formData.gender === gender
                  ? 'bg-indigo-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onPress={() => handleInputChange('gender', gender)}
            >
              <Text
                className={`text-center font-medium ${
                  formData.gender === gender ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activity Level Selector */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Activity Level
        </Text>
        <View className="flex-row flex-wrap">
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level}
              className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                formData.activityLevel === level
                  ? 'bg-indigo-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onPress={() => handleInputChange('activityLevel', level)}
            >
              <Text
                className={`text-center font-medium ${
                  formData.activityLevel === level ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dietary Preferences Selector */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dietary Preferences
        </Text>
        <View className="flex-row flex-wrap">
          {dietaryPreferences.map((diet) => (
            <TouchableOpacity
              key={diet}
              className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                formData.dietaryPreferences === diet
                  ? 'bg-indigo-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onPress={() => handleInputChange('dietaryPreferences', diet)}
            >
              <Text
                className={`text-center font-medium ${
                  formData.dietaryPreferences === diet ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {diet}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Allergies Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Allergies
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Enter any allergies"
          placeholderTextColor="#A1A1A1"
          value={formData.allergies}
          onChangeText={(text) => handleInputChange('allergies', text)}
        />
      </View>

      {/* Current Eating Habits Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Eating Habits
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Describe your current eating habits"
          placeholderTextColor="#A1A1A1"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.currentEatingHabits}
          onChangeText={(text) => handleInputChange('currentEatingHabits', text)}
        />
      </View>

      {/* Target Weight Input */}
      <View className="mb-4">
        <Text className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Goals
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-gray-200"
          placeholder="Enter your Goals"
          placeholderTextColor="#A1A1A1"
          value={formData.goals}
          onChangeText={(text) => handleInputChange('goals', text)}
        />
      </View> 

      {/* Submit Button */}
      <TouchableOpacity
        className={`mt-6 bg-indigo-500 py-4 rounded-lg shadow-lg mb-10 ${
          !formData.age ||
          !formData.weight ||
          !formData.gender ||
          !formData.activityLevel ||
          !formData.dietaryPreferences
            ? 'opacity-50'
            : ''
        }`}
        disabled={
          !formData.age ||
          !formData.weight ||
          !formData.gender ||
          !formData.activityLevel ||
          !formData.dietaryPreferences
        }
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold text-lg ">
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserDetailsForm;
