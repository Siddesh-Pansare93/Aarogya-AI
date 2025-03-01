// store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userDataReducer from './features/userDataSlice';
import userAuthReducer from './features/userAuthSlice';
import userDietReducer from './features/userDietSlice';
import dailyIntakeReducer from "./features/dailyIntakeSlice"

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = (state : any, action: any) => {
  if (action.type === 'RESET_STORE') {
    AsyncStorage.clear(); // Clear AsyncStorage
    state = undefined; // Reset state in memory
  }
  return combineReducers({
    userData: userDataReducer,
    auth: userAuthReducer,
    diet: userDietReducer,
    dailyIntake: dailyIntakeReducer,
  })(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
// Define RootState type
export type RootState = ReturnType<typeof store.getState>;
export default store;
