import {createSlice} from '@reduxjs/toolkit'

export const professionalState = createSlice({
    name:'professional',
    initialState: {
        Token: null,
        proName: null,
        proId:null,
        proImage:'',
    },
    reducers: {
        proLogin(state,action){
            state.Token = action.payload.token
        },
        proName(state,action){
            state.proName = action.payload.proname
        },
        proId(state,action){
            state.proId = action.payload.id
        },
        proImage(state,action){
            state.Image = action.payload.image
            console.log(action.payload.image);
        },
        proLogout(state,action) {
            state.Token = ""
            state.proName= ""
            state.proId= ""
            state.proImage= ""
        }
    },

})
export const {proLogin,proName,proId,proImage,proLogout} = professionalState.actions
export default professionalState.reducer