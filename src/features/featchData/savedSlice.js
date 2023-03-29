import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/api';
const initialState = {
  profileSavedPosts:[],
  status: 'idle',
};
export const getProfileSavedposts =createAsyncThunk(
    "saved/getProfileSavedposts",
    async()=>{
      try {
        let response = await axiosInstance.get(`/api/posts/saved/all`)
        return response.data.savedPosts
      } catch (error) {
        return error.response
      }
    }
)
export const savePost =createAsyncThunk(
  "saved/savePost",
  async(id)=>{
    try {
      let response = await axiosInstance.put(`/api/posts/saved/${id}`)
      return response.data
    } catch (error) {
      return error.response
    }
  }
)
export const removesavedPost =createAsyncThunk(
  "saved/removesavedPost",
  async(id)=>{
    try {
      let response = await axiosInstance.put(`/api/posts/saved/remove/${id}`)
      return response.data
    } catch (error) {
      return error.response
    }
  }
)
export const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {},
  extraReducers:{
    [getProfileSavedposts.fulfilled]:((state,action)=>{
        state.profileSavedPosts=[...action.payload]
    })
  },
});
export default savedSlice.reducer;
