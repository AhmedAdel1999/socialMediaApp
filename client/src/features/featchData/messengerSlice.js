import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import socket from "../../components/utils/socket"
import axiosInstance from '../../components/utils/api';
const initialState = {
  allConvMessages:[],
  status: 'idle',
};

export const getconvmessages =createAsyncThunk(
    "messenger/getconvmessages",
    async(convId)=>{
        try {
            let response= await axiosInstance.get(`/api/message/${convId}`)
            return response.data
        } catch (error) {
            return error.response
        }
    }
)
export const addmessage =createAsyncThunk(
    "messenger/addmessage",
    async({convId,body,userId,senderId})=>{
       
        try {
            let response= await axiosInstance.post(`/api/message/${convId}`,body)
            socket.emit('message', {
                body,
                userId,
                senderId,
            });
            return response.data
        } catch (error) {
            return error.response
        }
    }
)
export const deletemessage =createAsyncThunk(
    "messenger/deletemessage",
    async(msgId)=>{
        try {
            let response= await axiosInstance.delete(`/api/message/${msgId}`)
            return response.data
        } catch (error) {
            return error.response
        }
    }
)
export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {},
  extraReducers:{
    [getconvmessages.fulfilled]:((state,action)=>{
        state.allConvMessages=[...action.payload]
    })
  },
});
export default messengerSlice.reducer;
