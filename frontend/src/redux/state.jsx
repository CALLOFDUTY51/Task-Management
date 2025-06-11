import {createSlice} from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"user",
    initialState:{
        user:null,
        admin:false
    },
    reducers:{
        setLogin:(state,action)=>{
            state.user=action.payload
            
        },
        setLogout:(state)=>{
            state.user=null;
            
        },
        
    }
})

export const {setLogin,setLogout}=userSlice.actions
export default userSlice.reducer