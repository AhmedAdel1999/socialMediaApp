import React, { useEffect,useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { Link } from "react-router-dom";
import moment from 'moment'
import {useSelector,useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { deletePost ,getAllPosts } from "../../../features/featchData/postsSlice";
import { getProfileSavedposts, removesavedPost } from "../../../features/featchData/savedSlice";
import classes from "./postHeader.module.css"

const PostHeader = ({post,setId,setShowModal,paramId}) =>{
    const {profileCurrInfo,allProfiles} = useSelector((state)=>state.profile)
    const allPosts = useSelector((state)=>state.posts.allPosts)
    const profileSavedPosts = useSelector((state)=>state.saved.profileSavedPosts)
    const currProfile=allProfiles.filter((ele)=>ele.user._id===post.user)[0]
    const[callback,setCallback]=useState(false)
    const[dropdownToggle,setDropdownToggle]=useState(false)
    const dispatch = useDispatch()


    useEffect(()=>{
        dispatch(getAllPosts())
     },[callback])


    const setEdit = (id) =>{
        setShowModal(true)
        setId(id)
    }

    const isSaved = (id) =>{
        let test=false
        profileSavedPosts.forEach(ele => {
            if(ele._id===id){test=true}
        });
        return test
    }
    const DeletePost = async (id) =>{
        if(window.confirm("Do you want to delete the post")){
            if(isSaved(id)){
                await dispatch(removesavedPost(id))
            }
            await dispatch(getProfileSavedposts())
            await dispatch(deletePost(id))
            setCallback(!callback)
        }
    }
    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://facebookcloneapi.onrender.com/post/${post._id}`)
    }
    
    return(
        <div className={classes.postHeader}>
            <div className={classes.creatorInfo}>
                <Link to={`/profile/${post.user}`}>
                   <img src={currProfile?.profileImg} alt="" />
                </Link>
                <Link to={`/profile/${post.user}`}>
                    <span>{post.name}</span>
                    <span>{moment(post.date).fromNow()}</span>
                </Link>
            </div>
            <div className={classes.postControlls}>
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setTimeout(() => {
                            setDropdownToggle(false)
                        }, 100);
                        
                    }}
                >
                    <FontAwesomeIcon onClick={()=>setDropdownToggle(!dropdownToggle)}
                    icon={faEllipsisV} />
                     
                </OutsideClickHandler>
                 
                {
                    dropdownToggle&&
                    <ul className={classes.dropdown}>
                        {
                            !paramId&&
                            <li>
                            <Link to={`/post/${post._id}`}>go to post</Link>
                            </li>
                        }
                        <li>
                        <span onClick={()=>handleCopyLink()}>copy link</span>
                        </li>
                        {
                            profileCurrInfo.user._id===post.user&&
                            <>
                            <li onClick={()=>setEdit(post._id)}>Edit</li>
                            <li onClick={()=>DeletePost(post._id)}>Delete</li>
                            </>
                        }
                    </ul>
                }
            </div>
        </div>
    )
}
export default PostHeader;