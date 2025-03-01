import { createSlice } from "@reduxjs/toolkit";

initialState = {
    status: false,
    userData : {}
}


const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = action.payload , 
            state.userData = action.payload
        },
        logout :(state ,action)=> {
            state.status = false,
            state.userData = {}
        }
    }
})


export const {login , logout } = userDataSlice.reducer

export default userDataSlice.reducer