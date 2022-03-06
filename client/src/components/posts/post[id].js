import React, { useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Createpost from "./createpost/Createpost";
import PostCard from "./postCard";
const SinglePost = () =>{
    const allPosts = useSelector((state)=>state.posts.allPosts)
    const {id}=useParams();
    const [postId,setId]=useState(null)
    const[showModal,setShowModal]=useState(false)
    const post=allPosts.filter((post)=>post._id===id)[0]
    let style={
        maxWidth:"1100px",
        minWidth:"300px",
        width:"100%",
        margin:"20px auto 0px"
    }
    return(
        <div className="singlepost" style={{...style}}>
            {
                post?
                <React.Fragment>
                    <Createpost showModal={showModal} setShowModal={setShowModal} id={id || postId} />
                    <PostCard key={post._id} setId={setId} setShowModal={setShowModal} post={post} paramId={id} />
                
                </React.Fragment>
                :
                <div>there is no post</div>
            }
            
        </div>
    )

}
export default SinglePost;