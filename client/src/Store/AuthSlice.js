import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: null,
    otp: {
        phone: "",
        hash: "",
        userId:"",
    }
}

export const AuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setAuth: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            if (user === null) {
                state.isAuth = false;
            } else {
                state.isAuth = true;
            }
        },

        SendOtp: (state, action) => {
            const { phone, hash, userId } = action.payload;
            state.otp.phone = phone;
            state.otp.hash = hash;
            state.otp.userId = userId;
        }
    },
})


export const { setAuth, SendOtp } = AuthSlice.actions

export default AuthSlice.reducer