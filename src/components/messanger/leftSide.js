import React,{useEffect, useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getallconversation } from "../../features/featchData/conversationSlice";
import setAuthToken from "../utils/setToken";
import classes from "./leftside.module.css"

const LeftSide = () =>{
    const allConversations = useSelector((state)=>state.conversation.allConversations)
    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const token = useSelector((state)=>state.user.token)
    const [val,setVal]=useState('')
    let [finalConversation,setFinalConversation]=useState([])
    
    useEffect(()=>{
      setAuthToken(token)
      let arr=[]
      allConversations.forEach(ele => {
          ele.members.forEach((memb)=>{
              if(memb._id!==profileCurrInfo.user._id && memb.username.includes(val)){
                  arr.push(ele)
              }
          })
      });
      setFinalConversation([...arr])
    },[val,allConversations.length])
    return(
        <div className={classes.leftSide}>
            <form className={classes.formData}>
                <input type="search" value={val} onChange={(e)=>setVal(e.target.value)}
                placeholder="Enter To Search" />
            </form>
            <div className={classes.allConversation}>
                {
                    finalConversation.length>0?
                    finalConversation.map((conv)=>{
                        return(
                            <React.Fragment key={conv._id}>
                                {
                                    conv.members.map((memb)=>{
                                        if(memb._id!==profileCurrInfo.user._id){
                                            return(
                                                <div className={classes.convItem} key={memb._id}>
                                                    <Link to={`/messenger/${conv._id}`}>
                                                      <img alt="" src={memb.profile.profileImg}/>
                                                      <span>{memb.profile.name}</span>
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </React.Fragment>
                        )
                    })
                    :
                    <div className={classes.notFoundConv}>item not found</div>
                }
            </div>
        </div>
    )
}
export default LeftSide;