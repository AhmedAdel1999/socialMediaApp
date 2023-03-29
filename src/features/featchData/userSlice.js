import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/api';
const initialState = {
  token:null,
  isError:false,
  isSuccess:false,
  isLoading:false,
  successMsg:"",
  errorMsg:"",
  status: 'idle',
};

export const register =createAsyncThunk(
  "user/register",
  async({email, username, fullname, password},{fulfillWithValue,rejectWithValue})=>{
    let body={email, username, password}
    let profileBody={name:fullname}
    let token=''
    try {
      let response = await axiosInstance.post("/api/users",body)
      token = await response.data.token
      let profile = axiosInstance.post("/api/profile",profileBody,{headers:{
        "x-auth-token":token
      }})
      await profile;
      return fulfillWithValue(token)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const login =createAsyncThunk(
  "user/login",
  async(obj,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.post("/api/auth",obj)
      return fulfillWithValue(await response.data.token)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const updateuser =createAsyncThunk(
  "user/updateuser",
  async({id,data},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response  = await axiosInstance.put(`/api/users/update/${id}`,data)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout:((state)=>{
      state.token=null;
    }),
    clearUserState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.successMsg="";
      state.errorMsg="";
    }),
    
  },
  extraReducers:{

    //register user
    [register.pending]:((state,action)=>{
      state.isLoading=true;
    }),
    [register.fulfilled]:((state,action)=>{
      state.token=action.payload;
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`Welecome Sir You Have Successfully Logged In`
    }),
    [register.rejected]:((state,action)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`${action.payload.data.errors[0].msg}`
    }),

    //login user
    [login.pending]:((state,action)=>{
      state.isLoading=true;
    }),
    [login.fulfilled]:((state,action)=>{
      state.token=action.payload
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`Welecome Sir You Have Successfully Logged In`
    }),
    [login.rejected]:((state,action)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`${action.payload.data.errors[0].msg}`
    }),

    //update user
    [updateuser.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.successMsg=`You Have Successfully Update Your Account`
    }),
    [updateuser.rejected]:((state)=>{
      state.isError=true;
      state.errorMsg=`Error!! Failed To Update Account`
    }),
  },
});
export const {clearUserState,logout}=userSlice.actions
export default userSlice.reducer;
