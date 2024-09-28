import {createSlice} from "@reduxjs/toolkit"
const usersSlice = createSlice({
    name: "users",
    initialState: {
        username: null,
        profilePicture: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { username, profilePicture } = action.payload;
            state.username = username;
            state.profilePicture = profilePicture;
        },
    },
});

export const {
    setUser
} = usersSlice.actions;
export default usersSlice.reducer;
