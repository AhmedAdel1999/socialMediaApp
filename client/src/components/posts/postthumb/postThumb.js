import React, { useState } from "react";
import {useSelector,useDispatch} from "react-redux"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare,faComment,faHeart,faBookmark } from '@fortawesome/free-solid-svg-icons'
import { getAllPosts, likepost, unlikepost } from "../../../features/featchData/postsSlice";
import { getProfileSavedposts, removesavedPost, savePost } from "../../../features/featchData/savedSlice";
import ShareModal from "../../utils/shareModal";
import classes from "./postthumb.module.css"

const PostThumb = ({postId}) =>{
    const profileSavedPosts = useSelector((state)=>state.saved.profileSavedPosts)
    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const allPosts = useSelector((state)=>state.posts.allPosts)
    const post = allPosts.filter((ele)=>ele._id===postId)[0]
    const [isShare,setIsShare]=useState(false)
    const dispatch = useDispatch();
    let url;

    const isSaved = (postId) =>{
        let test = false;
        profileSavedPosts.forEach(ele => {
            if(ele._id===postId){test=true}
        });
        return test;
    }
    
    const SavePost = async (postId) =>{
        await dispatch(savePost(postId))
        await dispatch(getProfileSavedposts())
    }

    const UnSavePost = async (postId) =>{
        await dispatch(removesavedPost(postId))
        await dispatch(getProfileSavedposts())
    }
    
    const isLiked = () =>{
        let test=false
        post.likes.forEach((x)=>{
           if(x.user===profileCurrInfo.user._id){test=true}
        })
        return test;
    }

    const LikePost = async(postId) =>{
       await dispatch(likepost(postId))
       await dispatch(getAllPosts())
    }

    const UnLikePost = async(postId) =>{
        await dispatch(unlikepost(postId))
        await dispatch(getAllPosts())
    }
    
    return(
        <div className={classes.postThumb}>
            <div className={classes.thumbActions}>
                <div className={classes.thumbActionsIcons}>
                    <FontAwesomeIcon icon={faHeart}
                        className={isLiked()?classes.activated:""}
                        onClick={()=>isLiked()?UnLikePost(post._id):LikePost(post._id)}
                    />
                    <Link to={`/post/${post._id}`}>
                        <FontAwesomeIcon icon={faComment} />
                    </Link>
                    <FontAwesomeIcon onClick={()=>setIsShare(!isShare)} icon={faShare} />
                </div>
                <div className={classes.thumbActionsIcons}>
                    <FontAwesomeIcon icon={faBookmark}
                    className={isSaved(post._id)?classes.activated:""}
                    onClick={()=>isSaved(post._id)?UnSavePost(post._id):SavePost(post._id)}
                    />
                </div>
            </div>
            <div className={classes.thumbActionsResults}>
                <p>{post.likes.length} likes</p>
                <p>{post.comments.length} comments</p>
            </div>
            {
                isShare&&<ShareModal url={`${url}/${post._id}`} />
            }
        </div>
    )
}
export default PostThumb;
