import React, { useEffect, useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import {Link} from "react-router-dom"
import { useSelector,useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive"
import { logout } from "../../features/featchData/userSlice";
import SearchingList from "../searching/searchingList"
import { clearPosts } from "../../features/featchData/postsSlice";
import { followuser,unfollowuser,getCurrprofile } from "../../features/featchData/profileSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faPaperPlane,faCaretDown,faUser,faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import classes from "./navbar.module.css"

const Navbar = ({toggleShow,setToggleShow}) =>{
    const dispatch = useDispatch();
    const history = useHistory();
    const[show,setShow]=useState(false)
    const [callback,setCallback] = useState(false)
    const[showSidebar,setShowSidebar]=useState(false)
    const toggle = useMediaQuery({maxWidth:992})
    const[navHeight,setNavHeight]=useState('')
    const[profileFilter,setProfileFilter]=useState([])
    const {profileCurrInfo,allProfiles} = useSelector((state)=>state.profile)

    useEffect(()=>{
       if(toggle){
        setNavHeight(`${window.innerHeight - 62}px`)
       }
    },[toggle])

    const handelLogout = () =>{
        dispatch(clearPosts())
        dispatch(logout())
       history.push("/")
    }

    const searching = (val) =>{
       if(val.length>0){
        setProfileFilter([...allProfiles.filter((ele)=>ele.name.includes(val))])
       }else{
        setProfileFilter([])
       }
    }
    
    const checkFollowing = (userid) =>{
        let test = false
         profileCurrInfo.following.forEach((x)=>{
             if(userid===x.user){
                test=true
            }
        })
        return test
     }

    const UnFollowUser =async (userid) =>{
        await dispatch(unfollowuser(userid))
        await dispatch(getCurrprofile())
    }

    const FollowUser =async (userid) =>{
        await dispatch(followuser(userid))
        setCallback(!callback)
    }



    return(
        <div className={classes.navbarSection}>
            <div className={classes.logo}>
                <Link to={"/"}>
                Facebook App
                </Link>
            </div>
            {
                toggle?
                showSidebar?
                <FontAwesomeIcon onClick={()=>setShowSidebar(!showSidebar)} className={classes.toggler} icon={faTimes} />
                :
                <FontAwesomeIcon onClick={()=>setShowSidebar(!showSidebar)} className={classes.toggler} icon={faBars} />
                :
                null
            }
            {
                toggle===false&&
                <div className={classes.searchbox}>
                <input type={classes.search}
                placeholder="&#128270; search"
                onChange={(e)=>searching(e.target.value)} />
                {
                   profileFilter.length>0&&
                   <ul className={classes.searchResult}>
                        {
                            profileFilter.map((x,ind)=>{
                                return <SearchingList 
                                key={ind}
                                name={x.name}
                                username={x.user.username}
                                bio={x.bio}
                                profileImg={x.profileImg}
                                id={x.user._id}
                                checkFollowing={checkFollowing(x.user._id)?true:false}
                                UnFollowUser={UnFollowUser}
                                FollowUser={FollowUser}
                            />
                            })
                        }
                   </ul> 
                }
            </div>
            }
            <ul className={`${classes.routes} ${showSidebar?classes.show:""}`}
            style={{height:toggle&&navHeight}}
            >
                
                <li>
                    <Link  to="/"
                    onClick={()=>{
                        setToggleShow(false)
                        setShowSidebar(false)
                    }}
                    >
                        <FontAwesomeIcon icon={faHome}/>
                    </Link>
                </li>
                {
                    toggle&&
                    <li>
                        <Link  to="/"
                        onClick={()=>{
                            setToggleShow(!toggleShow)
                            setShowSidebar(!showSidebar)
                        }}
                        >
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                    </li>
                }
                <li>
                <Link to="/messenger"  onClick={()=>setShowSidebar(false)}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Link>
                </li>
                <li className={classes.profileIcon}>
                    <div className={classes.profileImg}>
                        <img src={profileCurrInfo.profileImg} alt=""/>
                        <OutsideClickHandler
                            onOutsideClick={() => {
                                setTimeout(() => {
                                    setShow(false)
                                },100);
                                
                            }}
                            >
                            <FontAwesomeIcon 
                            onClick={()=>setShow(!show)} icon={faCaretDown} 
                            />
                        </OutsideClickHandler>
                    </div>
                    {
                        show&&
                        <ul className={classes.dropdown}>
                            <li>
                                <Link onClick={()=>setShowSidebar(false)} to="/profile" >Profile</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={handelLogout}>Logout</Link>
                            </li>
                        </ul>
                    }
                </li>
                {
                    toggle&&
                    <li className={classes.searchBar}>
                            <input type={classes.search}
                            placeholder="&#128270; search"
                            onChange={(e)=>searching(e.target.value)} />
                            {
                                profileFilter.length>0&&
                                <ul className={classes.searchResult}>
                                        {
                                            profileFilter.map((x,ind)=>{
                                                return <SearchingList 
                                                key={ind}
                                                name={x.name}
                                                username={x.user.username}
                                                bio={x.bio}
                                                profileImg={x.profileImg}
                                                id={x.user._id}
                                                checkFollowing={checkFollowing(x.user._id)?true:false}
                                                UnFollowUser={UnFollowUser}
                                                FollowUser={FollowUser}
                                            />
                                            })
                                        }
                                </ul> 
                            }
                    </li>
                }
            </ul>
            
        </div>
    )
}
export default Navbar;