import React from "react";
import PostBody from "./postBody/postBody";
import PostComments from "./postcomments/postComments";
import PostHeader from "./postHeader/postHeader";
import PostThumb from "./postthumb/postThumb";

let cartStyle={
  backgroundColor:"#1F1F23",
  padding:"15px",
  borderRadius:"5px"
}
const PostCard = ({post,setId,setShowModal,paramId}) =>{
  return(
    <div className="postCart" style={{...cartStyle}}>
        <PostHeader setId={setId} setShowModal={setShowModal} post={post} paramId={paramId} />
        <PostBody post={post} />
        <PostThumb postId={post._id} />
        <PostComments postId={post._id} />
    </div>
  )
}
export default PostCard;