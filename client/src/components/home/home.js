import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux"
import Createpost from "../posts/createpost/Createpost";
import { useMediaQuery } from "react-responsive"
import PostCard from "../posts/postCard";
import SearchingList from "../searching/searchingList";
import { getAllPosts } from "../../features/featchData/postsSlice";
import { followuser,getCurrprofile } from "../../features/featchData/profileSlice";
import classes from  "./home.module.css"


const Home = ({toggleShow}) =>{

    const {profileCurrInfo,allProfiles} = useSelector((state)=>state.profile)
    const allPosts= useSelector((state)=>state.posts.allPosts)
    const dispatch = useDispatch()
    const toggle = useMediaQuery({maxWidth:992})
    const[showModal,setShowModal]=useState(false)
    const[id,setId]=useState(null)
    useEffect(()=>{
        dispatch(getAllPosts())
    },[])
    const mayNow = ()=>{
        let arr=[]
        mainLoop:
        for (let i = 0; i < allProfiles.length; i++) {
            let test = false
            childLoop:
            for (let x = 0; x < profileCurrInfo.following.length; x++) {
                if(allProfiles[i].user._id!==profileCurrInfo.following[x].user){
                    test = false    
                }else{
                    test =true
                    break childLoop;
                }
            }
            if(test===false){
                arr.push(allProfiles[i])
            }
        }
        return arr.filter((ele)=>ele.user._id!==profileCurrInfo.user._id);
    }
    const filterPosts = (postUserId) =>{
        let test = false
        profileCurrInfo.following.forEach((ele)=>{
            if(ele.user===postUserId){test=true}
        })
        return test
    }

    const FollowUser =async (userid) =>{
        await dispatch(followuser(userid))
        await dispatch(getCurrprofile())
    } 

    const showPepole = () =>{
        let show = false
        if((toggle===false)||(toggle===true&&toggleShow===true)){
            show=true
        }
        return show
    }
    const showPosts = () =>{
        let show = false
        if((toggle===false)||(toggle===true&&toggleShow===false)){
            show=true
        }
        return show
    }
   
    return(
        <div className={classes.homeSection}>
            {
                showPosts()===true&&
                <div className={classes.postsContainer}>
                <div className={classes.createPost}>
                    <img src={profileCurrInfo.profileImg} alt="" />
                    <button onClick={()=>setShowModal(true)}>what do you think?</button>
                    <Createpost showModal={showModal} setShowModal={setShowModal} id={id} />
                </div>
                <div className={classes.allposts}>
                    {allPosts.length>0?
                        allPosts.map((post,ind)=>{
                            let check=false
                            if(post.user===profileCurrInfo.user._id || filterPosts(post.user)){
                                check=true
                            return <PostCard key={post._id} setId={setId} setShowModal={setShowModal} post={post} />
                            }
                            if(!check&&allPosts.length-1===ind){
                                return <div key={Math.random()} className={classes.noPosts}>write your own posts and follow some users</div>
                            }
                        })
                    :
                    <div className={classes.noPosts}>write your own posts and follow some users</div>
                    }
                </div>   
            </div>
            }
            
            {
                showPepole()===true?
                <div className={classes.mayKnow}>
                    <h3>pepole you may now</h3>
                    <ul>
                    {
                        mayNow().map((x,ind)=>{
                            return <SearchingList 
                            key={ind}
                            name={x.name}
                            username={x.user.username}
                            bio={x.bio}
                            profileImg={x.profileImg}
                            id={x.user._id}
                            checkFollowing={false}
                            UnFollowUser={null}
                            FollowUser={FollowUser}
                        />
                        })
                    }
                    </ul>
                </div>
            :null
            }
            
        </div>        
    )
}
export default Home