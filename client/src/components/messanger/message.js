import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./message.module.css"

const Message = ({message,profileCurrInfo}) =>{
    const {allProfiles} = useSelector((state)=>state.profile)
    const profImg = allProfiles.filter((ele)=>ele.user._id===message.sender)[0].profileImg
    return(
        <div className={`${classes.message} ${profileCurrInfo.user._id===message.sender?classes.msgSender:classes.msgReciever}`}>
                <div className={classes.msgContent}>
                    <img className={classes.profImg} alt="" src={profImg} />
                    {
                        message.text.length>0&&
                        <p className={classes.msgText}>{message.text}</p>
                    }
                    {
                    
                        message.media.length>0&&
                        message.media.map((img,index)=>{
                            return(
                                <img className={classes.msgImg} key={index} alt="" src={img}/>
                            )
                        })
                    
                    }  
                    <span className={classes.msgDate}>
                        {new Date(message.createdAt).toLocaleString()}
                    </span>
                </div>
                
        </div>
    )
}
export default Message;