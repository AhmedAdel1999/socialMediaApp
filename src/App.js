import React, { useEffect, useState } from 'react';
import {BrowserRouter,Route,Switch} from "react-router-dom"
import { useSelector,useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications"
import { clearUserState } from './features/featchData/userSlice';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/home';
import Profile from './components/profile/Profile';
import PageNotFound from './components/utils/PageNotFound';
import Followers from './components/following/Followers';
import Followings from './components/following/Following';
import setAuthToken from './components/utils/setToken';
import EditProfile from './components/editprofile/EditProfile';
import SinglePost from './components/posts/post[id]';
import Messenger from './components/messanger/messengerCard';
import { getallconversation } from './features/featchData/conversationSlice';
import { getProfileSavedposts } from './features/featchData/savedSlice';
import { getAllProfiles, getCurrprofile } from './features/featchData/profileSlice';
import './App.css';


const App = () => {
  const dispatch = useDispatch();
  const { addToast:notify } = useToasts();
  const[AppHeight,setAppHeight]=useState('100vh')
  const [toggleShow,setToggleShow] = useState(false)
  const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
  const {token,isError,isSuccess,successMsg} = useSelector((state)=>state.user)
  const len = Object.keys(profileCurrInfo).length
 
  useEffect(()=>{
    const fun = async () =>{
      setAuthToken(token)
      await dispatch(getCurrprofile())
      await dispatch(getAllProfiles())
      await dispatch(getallconversation())
      await dispatch(getProfileSavedposts())
    }
    if(token){
      fun();
    }
  },[token])

  useEffect(()=>{
    dispatch(clearUserState())
  },[])

  useEffect(()=>{
    if(isSuccess){
      notify(`${successMsg} from app`,
      {appearance: 'success',autoDismiss:"true"})
      dispatch(clearUserState())
    }
    setAppHeight(`${window.innerHeight-1}px`)
  },[isError,isSuccess])
  
  return (
    <BrowserRouter>
      <div className="App" style={{height:AppHeight}}>
        {token&&<Navbar toggleShow={toggleShow} setToggleShow={setToggleShow}/>}
        <Switch>
          <Route path="/" exact strict render={()=>token&&len>0?<Home toggleShow={toggleShow} />:<Login />} />
          <Route path="/register" exact strict component={Register} />
          <Route path="/messenger" exact strict component={token?Messenger:PageNotFound} />
          <Route path="/messenger/:id" exact strict component={token?Messenger:PageNotFound} />
          <Route path="/post/:id" exact strict component={token?SinglePost:PageNotFound} />
          <Route path="/profile" exact strict component={token?Profile:PageNotFound} />
          <Route path="/profile/:id" exact strict component={token?Profile:PageNotFound} />
          <Route path="/editprofile" exact strict component={token?EditProfile:PageNotFound} />
          <Route path="/followers" exact strict component={token?Followers:PageNotFound} />
          <Route path="/followers/:id" exact strict component={token?Followers:PageNotFound} />
          <Route path="/following" exact strict component={token?Followings:PageNotFound} />
          <Route path="/following/:id" exact strict component={token?Followings:PageNotFound} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
