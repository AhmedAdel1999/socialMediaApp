import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentBody from "../../comments/commentbody/commentBody";
import CommentHeader from "../../comments/commentheader/commentHeader";
import CommentReplay from "../../comments/commentreplays/commentReplay";
import InputComment from "../../comments/inputcomment/inputComment";
import classes from "./postcomments.module.css"
const PostComments = ({postId}) =>{
    const allPosts = useSelector((state)=>state.posts.allPosts)
    const post = allPosts.filter((ele)=>ele._id===postId)[0]
    const comments = post.comments.filter((x)=>!x.reply)
    const replays = post.comments.filter((x)=>x.reply)
    const[next,setNext]=useState(2)
    let finalcom = comments.slice(0,next)
    return(
        <div className={classes.postComments}>
            {
                finalcom.map((x)=>{
                    return(
                        <div className="comment" key={x._id}>
                            <CommentHeader comment={x} />
                            <CommentBody comment={x} post={post} replayId={x._id} />
                            <CommentReplay post={post} commentId={x._id} replayId={x._id} replays={replays} />
                        </div>
                    )
                })
                
            }
            {
                comments.length - next > 0
                ? <span
                onClick={() => setNext(next + 10)}>
                    See more comments...
                </span>

                : comments.length > 2 &&
                <span
                onClick={() => setNext(2)}>
                    Hide comments...
                </span>
            }
            <InputComment postId={post._id} />
        </div>
    )
}
export default PostComments;