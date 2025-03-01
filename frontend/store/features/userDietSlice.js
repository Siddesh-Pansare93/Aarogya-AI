// src/redux/nutritionalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nutrients: {},  // Store nutrients as a dynamic object
  mealSuggestions: [],
};

const nutritionalSlice = createSlice({
  name: 'nutritionalData',
  initialState,
  reducers: {
    setNutritionalData: (state, action) => {
      const { nutrients, mealSuggestions } = action.payload;
      state.nutrients = nutrients;  // Directly store the entire nutrients object
      state.mealSuggestions = mealSuggestions;
    },
    clearNutritionalData: (state) => {
      state.nutrients = {};  // Clear the nutrients object
      state.mealSuggestions = [];
    },
  },
});

export const { setNutritionalData, clearNutritionalData } = nutritionalSlice.actions;

export default nutritionalSlice.reducer;
