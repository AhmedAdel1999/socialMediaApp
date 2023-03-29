import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./commentheader.module.css"

const CommentHeader = ({comment}) =>{
    const {allProfiles} = useSelector((state)=>state.profile)
    let currProfile=allProfiles.filter((ele)=>ele.user._id===comment.user)[0]
    return(
        <div className={classes.commentHeader}>
            <Link to={`/profile/${comment.user}`}>
                <img src={currProfile?.profileImg} alt="" />
                <span>{currProfile?.name}</span>
            </Link>
        </div>
    )
}
export default CommentHeader;