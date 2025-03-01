import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  age: null,
  weight: null,
  gender: '',
  medicalHistory: '',
  goals: '',
};

const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails : (state , action) => {
      state.age = action.payload.age;
      state.weight = action.payload.weight;
      state.gender = action.payload.gender;
      state.medicalHistory = action.payload.medicalHistory;
      state.goals = action.payload.goals;
    } ,
    // setAge: (state, action) => {
    //   state.age = action.payload;
    // },
    // setWeight: (state, action) => {
    //   state.weight = action.payload;
    // },
    // setGender: (state, action) => {
    //   state.gender = action.payload;
    // },
    // setMedicalHistory: (state, action) => {
    //   state.medicalHistory = action.payload;
    // },
    // setGoals: (state, action) => {
    //   state.goals = action.payload;
    // },
    resetUser: () => initialState,
  },
});

export const {  resetUser , setUserDetails } = userDataSlice.actions;

export default userDataSlice.reducer;
