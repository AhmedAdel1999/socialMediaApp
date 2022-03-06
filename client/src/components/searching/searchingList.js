import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from  "./search.module.css"
const SearchingList = ({profileImg,name,username,id,checkFollowing,UnFollowUser,FollowUser}) =>{
    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const checkCurrent = () =>{
        let test=false
        if(profileCurrInfo.user._id===id){
            test=true;
        }
        return test;
    }
    return (
        <li className={classes.profileItem}>
            <div className={classes.profileInfo}>
                <Link to={`/profile/${id}`}>
                    <img src={profileImg} alt=""/>
                </Link>
                <div className={classes.infoDetails}>
                    <Link to={`/profile/${id}`}>
                    <span>{name}</span>
                    <span>{username}</span>
                    </Link>
                </div>
            </div>
            <div className={classes.btns}>
                {checkCurrent()?null
                :checkFollowing?
                <button onClick={()=>UnFollowUser(id)}>unfollow</button>
                :
                <button onClick={()=>FollowUser(id)}>follow</button>
                }
                
            </div>
        </li>
    )
}
export default SearchingList