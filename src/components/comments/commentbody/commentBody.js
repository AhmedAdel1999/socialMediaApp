import React, { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart,faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useSelector,useDispatch } from "react-redux";
import { deletecomment, getAllPosts, likecomment, unlikecomment, updatecomment } from "../../../features/featchData/postsSlice";
import InputComment from "../inputcomment/inputComment";
import classes from "./commentbody.module.css"

const CommentBody = ({comment,post,replayId}) =>{

    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const dispatch = useDispatch();
    const[update,setUpdate]=useState(false)
    const[replay,setReplay]=useState(false)
    const[showDropdown,setShowDropdown]=useState(false)
    const[textUpdate,setTextUpdate]=useState(comment.text)
    const tag={name:comment.name,username:comment.username,user:comment.user,profileImage:comment.profileImage,}
    
    const isLiked = (commentId) =>{
        let test=false
        post.comments.forEach((ele)=>{
            if(ele._id===commentId){
                ele.likes.forEach((x)=>{
                    if(x.user===profileCurrInfo.user._id){test=true}
                 })
            }
        })
        return test;
    }

    const LikeComment = async(commentId) =>{
        await dispatch(likecomment({postId:post._id,commentId:commentId}))
        await dispatch(getAllPosts())
    }
    const UnLikeComment = async(commentId) =>{
        await dispatch(unlikecomment({postId:post._id,commentId:commentId}))
        await dispatch(getAllPosts())
    }
    const UpdateComment = async() =>{
        await dispatch(updatecomment({postId:post._id,commentId:comment._id,text:textUpdate}))
        await dispatch(getAllPosts())
        setUpdate(false)
    }
    const DeleteComment = async() =>{
       await dispatch(deletecomment({postId:post._id,commentId:comment._id}))
       await dispatch(getAllPosts())
    }
    return(
        <div className={classes.commentBody}>
            {update?
            <textarea onChange={(e)=>setTextUpdate(e.target.value)} value={textUpdate}></textarea>
            :
            <p className={classes.commentText}>{comment.text}</p>
            }
            
            <div className={classes.commentActions}>
                <div>
                    <span>{moment(comment.date).fromNow()}</span>
                    <span>{comment.likes.length} likes</span>
                    {
                        update?
                        <>
                        <span onClick={()=>UpdateComment()}>update</span>
                        <span onClick={()=>setUpdate(false)}>cansel</span>
                        </>
                        :
                        null
                    }
                    {
                        update?
                        null
                        :replay?
                        <span onClick={()=>setReplay(false)}>cansel</span>
                        :
                        <span onClick={()=>setReplay(true)}>replay</span>
                    }
                </div>
                <div>
                    {
                        comment.user===profileCurrInfo.user._id&&
                        <OutsideClickHandler
                            onOutsideClick={() => {
                                setTimeout(() => {
                                    setShowDropdown(false)
                                }, 100);
                            }}
                            >
                            <FontAwesomeIcon icon={faEllipsisV} onClick={()=>setShowDropdown(!showDropdown)} />
                        </OutsideClickHandler>
                    }
                    
                    {
                        showDropdown&&
                        <ul className={classes.commentRules}>
                            <li onClick={()=>setUpdate(true)}>Edit</li>
                            <li onClick={()=>DeleteComment()}>Remove</li>
                        </ul>
                    }
                    
                    <FontAwesomeIcon icon={faHeart} 
                    className={isLiked(comment._id)?classes.activated:""}
                    onClick={()=>isLiked(comment._id)?UnLikeComment(comment._id):LikeComment(comment._id)}
                    />
                </div>
            </div>
            {
                replay&&<InputComment
                    replay={replay} setReplay={setReplay} postId={post._id}
                    replayId={replayId} tag={tag}
                />
            }
        </div>
    )
}
export default CommentBody;