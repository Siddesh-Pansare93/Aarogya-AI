// Add this type for state to explicitly define `ingredients` as string[].
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DailyIntakeState {
  nutrients: { [key: string]: number };
  lastUpdated: number | null;
  dailyIntakeHistory: Array<{ date: string; nutrients: { [key: string]: number } }>;
  ingredients: string[]; // Specify ingredients as an array of strings
}

const initialState: DailyIntakeState = {
  nutrients: {},
  lastUpdated: null,
  dailyIntakeHistory: [],
  ingredients: [], // Array of strings
};

const dailyIntakeSlice = createSlice({
  name: "dailyIntake",
  initialState,
  reducers: {
    // ✅ Add or Update Nutrients (Adding values if already present, or creating new ones)
    setNutrients(state, action) {
      const currentTime = Date.now();
      const todayDate = new Date().toLocaleDateString();

      // Clean up and add/update nutrient values
      Object.entries(action.payload).forEach(([key, value]: [string, any]) => {
        // Clean the value (strip any unwanted characters like 'g')
        const cleanedValue = (value as string).replace(/[^\d.-]/g, ''); // Keep only digits and decimals
        const numericValue = parseFloat(cleanedValue);

        // If the nutrient is already present, add the new value to it, else create a new entry
        if (state.nutrients[key]) {
          state.nutrients[key] += numericValue;
        } else {
          state.nutrients[key] = numericValue;
        }
      });

      // Handle daily reset if necessary
      if (state.lastUpdated && currentTime - state.lastUpdated > 86400000) {
        const existingEntry = state.dailyIntakeHistory.find(entry => entry.date === todayDate);
        
        if (!existingEntry) {
          state.dailyIntakeHistory.push({
            date: todayDate,
            nutrients: { ...state.nutrients },
          });
        }

        // Reset nutrients for the new day
        state.nutrients = {};
      }

      state.lastUpdated = currentTime;
    },

    // ✅ Reset Nutrients
    resetNutrients(state) {
      state.nutrients = {};
      state.lastUpdated = null;
    },

    // ✅ Add Ingredients (Prevents Duplicates)
    addIngredient(state, action: PayloadAction<string>) {
      if (!state.ingredients.includes(action.payload)) {
        state.ingredients.push(action.payload);
      }
    },

    // ✅ Remove Ingredient
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(ing => ing !== action.payload);
    },

    // ✅ Reset Ingredients
    resetIngredients(state) {
      state.ingredients = [];
    },
  },
});



export const { setNutrients, resetNutrients, addIngredient, removeIngredient, resetIngredients } = dailyIntakeSlice.actions;

export default dailyIntakeSlice.reducer;
