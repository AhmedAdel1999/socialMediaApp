import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/api';
const initialState = {
  allConversations:[],
  newConversation:{},
  isSuccess:false,
  isLoading:false,
  status: 'idle',
};

export const getallconversation =createAsyncThunk(
    "conversation/getallconversation",
    async()=>{
        let res = await axiosInstance.get(`/api/conversation`);
        for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].members.length; j++) {
                const profile = await axiosInstance.get(
                    `/api/profile/user/id/${res.data[i].members[j]._id}`
                );
                res.data[i].members[j].profile = profile.data;
            }
        }
     return res.data
    }
)
export const createconversation =createAsyncThunk(
    "conversation/createconversation",
    async(id)=>{
        try {
            let response = await axiosInstance.post(`/api/conversation/${id}`)
            return response.data
        } catch (error) {
            return error.response
        }
    }
)
export const deleteconversation =createAsyncThunk(
    "conversation/deleteconversation",
    async(id)=>{
        try {
            let res = await axiosInstance.delete(`/api/conversation/${id}`)
            return res
        } catch (error) {
            return error.response
        }
    }
)
export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    clearConvState:((state)=>{
        state.isLoading=false;
        state.isSuccess=false;
        state.newConversation={}
     })
  },
  extraReducers:{
    [createconversation.pending]:((state)=>{
        state.isLoading=true;
    }),
    [createconversation.fulfilled]:((state,action)=>{
        state.isLoading=false;
        state.isSuccess=true
        state.newConversation={...action.payload}
    }),
    [getallconversation.fulfilled]:((state,action)=>{
        state.allConversations=[...action.payload]
    })
  },
});
export const{clearConvState}=conversationSlice.actions
export default conversationSlice.reducer;
