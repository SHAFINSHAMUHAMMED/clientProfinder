import {createSlice} from '@reduxjs/toolkit'

export const adminState = createSlice({
    name:'admin',
    initialState: {
        Token: null,
        adminName: null,
    },
    reducers: {
        adminLogin(state,action){
            state.Token = action.payload.token
        },
        adminName(state,action){
            state.adminName = action.payload.adminname
        },
        adminLogout(state,action) {
            state.Token = ""
            state.adminName= ""
        }
    },

})
export const {adminLogin,adminName,adminLogout} = adminState.actions
export default adminState.reducer