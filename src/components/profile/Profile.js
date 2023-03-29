import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useParams } from "react-router";
import { getProfileposts } from "../../features/featchData/postsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import setAuthToken from "../utils/setToken";
import { getOtherprofile,followuser, getCurrprofile,unfollowuser } from "../../features/featchData/profileSlice";
import { getProfileSavedposts,removesavedPost } from "../../features/featchData/savedSlice";
import ProfileInfo from "../profileinfo/ProfileInfo";
import PostCard from "../posts/postCard";
import Createpost from "../posts/createpost/Createpost";
import classes from "./profile.module.css"


const Profile = () =>{
    const {profileCurrInfo,otherProfileInfo} = useSelector((state)=>state.profile)
    const {profilePosts,allPosts} = useSelector((state)=>state.posts)
    const profileSavedPosts = useSelector((state)=>state.saved.profileSavedPosts)
    const token = useSelector((state)=>state.user.token)
    const[postsOrSaved,setPostsOrSaved]=useState("posts")
    const[callback,setCallback]=useState(false)
    const[showModal,setShowModal]=useState(false)
    const[postId,setId]=useState(null)
    const dispatch = useDispatch()
    const {id} = useParams()
    useEffect(()=>{
       
       if(id){
        dispatch(getProfileposts(id))
        dispatch(getOtherprofile(id))
       }else{
        setAuthToken(token)
        dispatch(getProfileposts(profileCurrInfo.user._id))
        dispatch(getProfileSavedposts())
       }
    },[callback,id])
    const isPostExist = (postId) =>{
        let test=false;
        allPosts.forEach((x)=>{
            if(x._id===postId){test=true}
        })
        return test
    }
    const FollowUser =async (id) =>{
        await dispatch(followuser(id))
        await dispatch(getCurrprofile())
        setCallback(!callback)
    }
    const UnFollowUser =async (id) =>{
        await dispatch(unfollowuser(id))
        await dispatch(getCurrprofile())
        setCallback(!callback)
     }
     const checkCurrent = () =>{
        let check=false
        if(profileCurrInfo.user._id===id){check=true}
        return check
     }
     const isEmpty = () =>{
        let check = false;
        if(Object.keys(otherProfileInfo).length===0){check=true}
        return check
     }
     const UnSavePost = async (postId) =>{
        await dispatch(removesavedPost(postId))
        await dispatch(getProfileSavedposts())
    }
    return(
        <div className={classes.profileSection}>
            <div className={classes.profileInfoSec}>
            <ProfileInfo 
                name={id?isEmpty()?profileCurrInfo.name:otherProfileInfo.name:profileCurrInfo.name}
                username={id?isEmpty()?profileCurrInfo.user.username:otherProfileInfo.user.username:profileCurrInfo.user.username}
                bio={id?isEmpty()?profileCurrInfo.bio:otherProfileInfo.bio:profileCurrInfo.bio}
                profileImg={id?isEmpty()?profileCurrInfo.profileImg:otherProfileInfo.profileImg:profileCurrInfo.profileImg}
                id={id?id:profileCurrInfo.user._id}
                followersLength={id?isEmpty()?profileCurrInfo.followers.length:otherProfileInfo.followers.length:profileCurrInfo.followers.length}
                followingLength={id?isEmpty()?profileCurrInfo.following.length:otherProfileInfo.following.length:profileCurrInfo.following.length}
                postsLength={profilePosts.length}
                FollowUser={FollowUser}
                UnFollowUser={UnFollowUser}
            />
            </div>
            <div className={classes.profilePosts}>
                <div className={classes.postsRoutes}>
                    <button onClick={()=>setPostsOrSaved("posts")}>posts</button>
                    {checkCurrent()||!id?<button onClick={()=>setPostsOrSaved("saved")}>saved</button>
                    :
                    null
                    }
                </div>
                {
                    postsOrSaved==="posts"?
                    <div className={classes.postsOrSaved}>
                        <Createpost showModal={showModal} setShowModal={setShowModal} id={postId} />
                        {profilePosts.map((post)=>{
                            return <PostCard key={post._id} setId={setId} setShowModal={setShowModal} post={post} />
                        })}
                    </div>
                    :
                    <div className={classes.postsOrSaved}>
                        <Createpost showModal={showModal} setShowModal={setShowModal} id={postId} />
                        {profileSavedPosts.map((x)=>{
                            if(isPostExist(x._id)){
                                return <PostCard key={x._id} setId={setId}
                                setShowModal={setShowModal} post={allPosts.filter((val)=>val._id===x._id)[0]} />
                            }else{
                                return(
                                    <div key={x._id} className={classes.notFoundPst}>
                                        <p>post is not found may be the creator delete it</p>
                                        <FontAwesomeIcon onClick={()=>UnSavePost(x._id)} icon={faBookmark} />
                                    </div>
                                )
                            }
                        })}
                    </div>
                }
            </div>
        </div>
    )
}
export default Profile
