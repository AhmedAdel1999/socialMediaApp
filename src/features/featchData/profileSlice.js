import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import socket from "../../components/utils/socket"
import axiosInstance from '../../components/utils/api';
const initialState = {
  profileCurrInfo:{},
  otherProfileInfo:{},
  followingList:[],
  searchProfiles:[],
  allProfiles:[],
  isError:false,
  isSuccess:false,
  isLoading:false,
  successMsg:"",
  errorMsg:"",
  status: 'idle',
};
export const getAllProfiles =createAsyncThunk(
  "profile/getAllProfiles",
  async()=>{
    try {
      let response = await axiosInstance.get("/api/profile/all")
      return await response.data
    } catch (error) {
      return error.response
    }
  }
)
export const getCurrprofile =createAsyncThunk(
  "profile/getCurrprofile",
  async()=>{
    try {
      let response = await axiosInstance.get("/api/profile")
      socket.emit("join",response.data.user._id)
      return await response.data
    } catch (error) {
      return error.response
    }
  }
)
export const searchProfile =createAsyncThunk(
  "profile/searchProfile",
  async(value)=>{
    const val = value || "nothing"
    let data = await axiosInstance.get(`/api/profile/user/${val}`).then((res)=>{
      return res.data
    }).catch((err)=>{
      alert(err)
    })
   return data
  }
)
export const updateProfile =createAsyncThunk(
  "profile/updateProfile",
  async(body)=>{
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
     try {
      await axiosInstance.post("/api/profile",body,config)
     } catch (error) {
       return error.response
     }
  }
)
export const getOtherprofile =createAsyncThunk(
  "profile/getOtherprofile",
  async(id)=>{
    let data = await axiosInstance.get(`/api/profile/user/id/${id}`).then((res)=>{
      console.log(res)
      return res.data
    }).catch((err)=>{
      alert(err)
    })
   return data
  }
)
export const getFolloweingList =createAsyncThunk(
  "profile/getFolloweingList",
  async(idList)=>{
    let arr=[];
    for (let i=0; i<idList.length; i++){
      let res =await axiosInstance.get(`/api/profile/user/id/${idList[i].user}`)
        arr.push(res.data)
    }
   return arr
  }
)
export const unfollowuser =createAsyncThunk(
  "profile/unfollowuser",
  async(id)=>{
      await axiosInstance.put(`/api/profile/delete/following/${id}`)
      await axiosInstance.put(`/api/profile/delete/follower/${id}`)
  }
)
export const followuser =createAsyncThunk(
  "profile/followuser",
  async(id)=>{
      await axiosInstance.put(`/api/profile/add/following/${id}`)
      await axiosInstance.put(`/api/profile/add/follower/${id}`)
  }
)
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.successMsg="";
      state.errorMsg="";
    })
  },
  extraReducers:{
    [getAllProfiles.fulfilled]:((state,action)=>{
      state.allProfiles=[...action.payload]
    }),
    [getCurrprofile.fulfilled]:((state,action)=>{
        state.profileCurrInfo={...action.payload}
    }),
    [getOtherprofile.fulfilled]:((state,action)=>{
      state.otherProfileInfo={...action.payload}
    }),
    [getFolloweingList.fulfilled]:((state,action)=>{
      state.followingList=[...action.payload]
    }),
    [searchProfile.fulfilled]:((state,action)=>{
      state.searchProfiles=[...action.payload]
    }),
    [updateProfile.pending]:((state)=>{
      state.isLoading=true;
    }),
    [updateProfile.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg="Profile Has Been Updated Successfully"
    }),
    [updateProfile.rejected]:((state,action)=>{
      console.log(action.payload)
      state.isError=true;
      state.isLoading=false;
      state.errorMsg="Error!! Failed To Update Profile"
    }),
  },
});
export const { clearProfState } = profileSlice.actions
export default profileSlice.reducer;
