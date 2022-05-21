import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    fullName: "",
}

export const detailsSlice = createSlice({
    name: 'details',
    initialState,
    reducers: {

        setFullName: (state, action) => {
            state.fullName = action.payload;
        },
    },
})


export const { setFullName } = detailsSlice.actions

export default detailsSlice.reducer