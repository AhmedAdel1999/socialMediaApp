import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getFolloweingList,getCurrprofile, unfollowuser, followuser, getOtherprofile } from "../../features/featchData/profileSlice";
import FollowList from "./FollowList";
import ProfileInfo from "../profileinfo/ProfileInfo";
import classes from "./follow.module.css"

const Followings = () =>{
    const {id} = useParams()
    const dispatch = useDispatch()
    const[callback,setCallback]=useState(false)
    const {profileCurrInfo,otherProfileInfo,followingList} = useSelector((state)=>state.profile)
    const profilePosts = useSelector((state)=>state.posts.profilePosts)
    const idList = id?otherProfileInfo.following:profileCurrInfo.following
    useEffect(()=>{
        dispatch(getFolloweingList(idList))
     },[callback,id])
     const checkFollowing = (userid) =>{
        let test = false
         profileCurrInfo.following.forEach((x)=>{
             if(userid===x.user){
                test=true
            }
        })
        return test
     }
     
     const UnFollowUser =async (userid) =>{
        await dispatch(unfollowuser(userid))
        await dispatch(getCurrprofile())
        if(id){await dispatch(getOtherprofile(id))}
        setCallback(!callback)
     }
     const FollowUser =async (userid) =>{
        await dispatch(followuser(userid))
        await dispatch(getCurrprofile())
        if(id){await dispatch(getOtherprofile(id))}
        setCallback(!callback)
     }
    return(
        <div className={classes.followPage}>
            <div className={classes.profileInfoSec}>
                <ProfileInfo 
                    name={id?otherProfileInfo.name:profileCurrInfo.name}
                    username={id?otherProfileInfo.user.username:profileCurrInfo.user.username}
                    bio={id?otherProfileInfo.bio:profileCurrInfo.bio}
                    profileImg={id?otherProfileInfo.profileImg:profileCurrInfo.profileImg}
                    id={id?id:profileCurrInfo.user._id}
                    followersLength={id?otherProfileInfo.followers.length:profileCurrInfo.followers.length}
                    followingLength={id?otherProfileInfo.following.length:profileCurrInfo.following.length}
                    postsLength={profilePosts.length}
                    FollowUser={FollowUser}
                    UnFollowUser={UnFollowUser}
                />
            </div>
            {followingList.length>0?
            <div className={classes.followSection}>
                <h3>Followings</h3>
                <ul className={classes.followList}>
                    {followingList.map((x,ind)=>{
                        return <FollowList 
                            key={ind}
                            name={x.name}
                            username={x.user.username}
                            bio={x.bio}
                            profileImg={x.profileImg}
                            id={x.user._id}
                            checkFollowing={checkFollowing(x.user._id)?true:false}
                            UnFollowUser={UnFollowUser}
                            FollowUser={FollowUser}
                        />
                    })}
                </ul>
            </div>
            :
            null
            }
        </div>
    )
}
export default Followings;
