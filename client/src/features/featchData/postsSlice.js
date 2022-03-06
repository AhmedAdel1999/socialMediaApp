import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/api';
const initialState = {
  profilePosts:[],
  allPosts:[],
  isLoading:false,
  status: 'idle',
};
export const getProfileposts =createAsyncThunk(
    "posts/getProfileposts",
    async(id,{fulfillWithValue,rejectWithValue})=>{
      try {
        let response = await axiosInstance.get(`/api/posts/user/${id}`)
        return fulfillWithValue(await response.data)
      } catch (error) {
        return rejectWithValue(error.response)
      }
    }
)
export const getAllPosts =createAsyncThunk(
  "posts/getAllPosts",
  async()=>{
    try {
      let response = await axiosInstance.get(`/api/posts/`)
      return await response.data
    } catch (error) {
      return error.response
    }
  }
)
export const Postpost =createAsyncThunk(
  "posts/Postpost",
  async(body,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.post(`/api/posts`,body)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(await error.response)
    }
  }
)
export const updatePost =createAsyncThunk(
  "posts/updatePost",
  async({id,body},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.put(`/api/posts/${id}`,body)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const deletePost =createAsyncThunk(
  "posts/deletePost",
  async(id)=>{
    try {
      let response = await axiosInstance.delete(`/api/posts/${id}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const likepost =createAsyncThunk(
  "posts/likepost",
  async(id)=>{
    try {
      let response = await axiosInstance.put(`/api/posts/like/${id}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const unlikepost =createAsyncThunk(
  "posts/unlikepost",
  async(id)=>{
    try {
      let response = await axiosInstance.put(`/api/posts/unlike/${id}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const commentonpost =createAsyncThunk(
  "posts/commentonpost",
  async({id,body})=>{
    try {
      let response = await axiosInstance.put(`/api/posts/comments/${id}`,{...body})
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const deletecomment =createAsyncThunk(
  "posts/deletecomment",
  async({postId,commentId})=>{
    try {
      let response = await axiosInstance.delete(`/api/posts/comments/delete/${postId}/${commentId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const updatecomment =createAsyncThunk(
  "posts/updatecomment",
  async({postId,commentId,text})=>{
    try {
      let response = await axiosInstance.put(`/api/posts/comments/update/${postId}/${commentId}`,{text:text})
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const likecomment =createAsyncThunk(
  "posts/likecomment",
  async({postId,commentId})=>{
    try {
      let response = await axiosInstance.put(`/api/posts/comments/like/${postId}/${commentId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const unlikecomment =createAsyncThunk(
  "posts/unlikecomment",
  async({postId,commentId})=>{
    try {
      let response = await axiosInstance.put(`/api/posts/comments/unlike/${postId}/${commentId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
)
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
     clearPosts:((state)=>{
       state.allPosts=[];
     })
  },
  extraReducers:{
    [Postpost.pending]:((state)=>{
      state.isLoading=true;
    }),
    [Postpost.fulfilled]:((state)=>{
      state.isLoading=false;
    }),
    [updatePost.pending]:((state)=>{
      state.isLoading=true;
    }),
    [updatePost.fulfilled]:((state)=>{
      state.isLoading=false;
    }),
    //get profile posts
    [getProfileposts.fulfilled]:((state,action)=>{
        state.profilePosts=[...action.payload]
    }),
    //get all posts
    [getAllPosts.fulfilled]:((state,action)=>{
      state.allPosts=[...action.payload]
    }),
  },
});
export const{clearPosts}=postsSlice.actions
export default postsSlice.reducer;
