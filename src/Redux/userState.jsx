import {createSlice} from '@reduxjs/toolkit'

export const userState = createSlice({
    name:'user',
    initialState: {
        Token: null,
        UserName: null,
        location: null,
        locationCoordinates: null,
        Id: null,
        Image: null,
    },
    reducers: {
        userLogin(state,action){
            state.Token = action.payload.token
        },
        userName(state,action){
            state.UserName = action.payload.username
        },
        userLocation(state,action){
            state.location = action.payload.location
        },
        userLocationCoordinates(state, action) {
            state.locationCoordinates=action.payload.coordinate
          },
        userId(state,action){
            state.Id = action.payload.id
        },
        userImage(state,action){
            state.Image = action.payload.image
        },
        UserLogout(state,action) {
            state.Token = ""
            state.UserName= ""
            state.location= ""
            state.Image=""
        }
    },

})
export const {userLogin,userName,userLocation,userLocationCoordinates,userId,userImage,UserLogout} = userState.actions
export default userState.reducer