import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { getconvmessages } from "../../features/featchData/messengerSlice";
import { createconversation, getallconversation,clearConvState } from "../../features/featchData/conversationSlice";
import Loading from "../loading/Loading";
import classes from "./profileinfo.module.css"


const ProfileInfo = ({followersLength,followingLength,UnFollowUser,FollowUser,postsLength,username,name,bio,id,profileImg}) =>{
    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const {allConversations,newConversation,isSuccess,isLoading} = useSelector((state)=>state.conversation)
    const history = useHistory()
    const dispatch= useDispatch()

    useEffect(()=>{
        dispatch(clearConvState())
    },[])

    useEffect(()=>{
        const fun = async()=>{
            await dispatch(getallconversation())
            dispatch(getconvmessages(newConversation._id));
            await dispatch(clearConvState())
            history.push(`/messenger/${newConversation._id}`)
        }
        if(isSuccess){
            fun();
        }
    },[isSuccess])

    const checkFollowing = () =>{
        let test = false
        profileCurrInfo.following.forEach(ele => {
            if(ele.user===id){
                test= true
            }
        });
        return test
    }
    
    const checkCurrent = () =>{
        let test = false
        if(id===profileCurrInfo.user._id){
            test=true
        }
        return test
    }

    const checkConv = async () =>{
        let test=false
        let convId
        allConversations.forEach((conv)=>{
            if((conv.members[0]._id===profileCurrInfo.user._id || conv.members[0]._id===id)&&(conv.members[1]._id===profileCurrInfo.user._id || conv.members[1]._id===id)){
                test=true
                convId=conv._id
            }
        })
        if(test===true){
           history.push(`/messenger/${convId}`)
        }else{
            await dispatch(createconversation(id))
        }
    }
    if(isLoading || isSuccess){
        return <Loading />
    }
    return(
        <div className={classes.profileHeader}>
            <div className={classes.profileInfo}>
                <img src={profileImg} className={classes.profileImg} alt=""/>
                <div className={classes.infoDetails}>
                    <h4>{name}</h4>
                    <p>{username}</p>
                    {bio.length?<p>{bio}</p>:null}
                </div>
            </div>
            <div className={classes.routesAndActions}>
                <div className={classes.routes}>
                    <Link to={`${!checkCurrent()?`${`/profile/${id}`}`:"/profile"}`}>{postsLength} posts</Link>
                    <Link to={`${!checkCurrent()?`${`/followers/${id}`}`:"/followers"}`}>{followersLength} followers</Link>
                    <Link to={`${!checkCurrent()?`${`/following/${id}`}`:"/following"}`}>{followingLength} following</Link>
                </div>
                {!checkCurrent() ? 
                  <div className={classes.actions}>
                      {checkFollowing()?
                      <button onClick={()=>UnFollowUser(id)}>unfollow</button>
                      :
                      <button onClick={()=>FollowUser(id)}>follow</button>
                      }
                      <button onClick={()=>checkConv()}>message</button>
                  </div>
                  :
                  <div className={classes.actions}>
                    <button>
                      <Link to={`/editprofile`}>Edit Profile</Link>
                    </button>
                  </div>
                  
                }
            </div>
        </div>
    )
}
export default ProfileInfo