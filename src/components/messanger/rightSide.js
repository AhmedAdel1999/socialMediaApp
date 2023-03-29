import React,{useEffect, useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faPaperPlane,faImage,faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons"
import { deleteconversation, getallconversation } from "../../features/featchData/conversationSlice";
import { addmessage, getconvmessages } from "../../features/featchData/messengerSlice";
import setAuthToken from "../utils/setToken";
import { imageUpload } from "../utils/imagesUpload";
import Message from "./message";
import socket from "../utils/socket"
import classes from "./rightside.module.css"

const RightSide = ({convId}) =>{
  
    const dispatch=useDispatch()
    const history=useHistory()
    const token = useSelector((state)=>state.user.token)
    const allConvMessages = useSelector((state)=>state.messenger.allConvMessages)
    const allConversations = useSelector((state)=>state.conversation.allConversations)
    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    let recieverProf = {}
    allConversations.forEach(ele => {
      if(ele._id===convId){
          recieverProf={...allConversations.filter((cove)=>cove._id===convId)[0].members.filter((memb)=>memb._id!==profileCurrInfo.user._id)[0].profile}
      }
    });

    const[files,setFiles] = useState([])
    const[text,setText]= useState('')
    /*socket.on('message', (data) => {
      dispatch(getconvmessages(convId));
    });*/ //after state upadates this code will be run also her
    useEffect(()=>{
      setAuthToken(token)
      if(convId){
        allConversations.forEach(ele => {
          if(ele._id===convId){
            dispatch(getconvmessages(convId));
          }
        });
        socket.on('message', (data) => {
          dispatch(getconvmessages(convId));
        });
        dispatch(getallconversation())
      }
    },[convId,files])

    const handelSubmit = async (e) =>{
        e.preventDefault();
      let media=[]
      if(files.length>0){
         let arr= await imageUpload(files)
         media=[...arr]
      }
      setAuthToken(token)
      await dispatch(addmessage({convId,body:{text:text,media:media},
        userId:recieverProf.user._id, senderId:profileCurrInfo.user._id
      }))
      await dispatch(getconvmessages(convId))
      setFiles([])
      setText('')
    }
    const DeleteConv = async () =>{
      //eslint-disable-next-line no-restricted-globals
      if(confirm("Do you want to delete this conversation?")===true){
        await dispatch(deleteconversation(recieverProf.user._id))
        await dispatch(getallconversation())
        history.push("/messenger")
      }
    }
    return(
        <div className={classes.rightSide}>
            {
                Object.keys(recieverProf).length>0?
                <React.Fragment>
                  <div className={classes.header}>
                     <div className={classes.headProfile}>
                        <Link to={`/profile/${recieverProf.user._id}`}>
                          <img src={recieverProf.profileImg} alt=""/>
                        </Link>
                        <Link to={`/profile/${recieverProf.user._id}`}>
                          <span >{recieverProf.name}</span>
                          <span >{recieverProf.user.username}</span>
                        </Link>
                     </div>
                     <FontAwesomeIcon icon={faTrash} onClick={()=>DeleteConv()} />
                   </div>
                   <div className={classes.coveBody}>
                      {
                        allConvMessages.map((message)=>{
                            return <Message key={message._id} convId={convId} profileCurrInfo={profileCurrInfo} message={message} />
                        })
                      }
                   </div>
                   {files.length>0?
                        <div className={classes.imgsUploades}>
                            {
                                  files.map((x,index)=>{
                                      return(
                                        <div key={index} className={classes.imgItem}>
                                          <img  src={URL.createObjectURL(x)}/>
                                          <FontAwesomeIcon onClick={()=>setFiles(files.filter((x,ind)=>ind!==index))} icon={faTimes} />
                                        </div>
                                            
                                      )
                                  })
                                }
                        </div>
                        :
                        null
                    }
                   <div className={classes.convFooter}>
                     <form onSubmit={handelSubmit} className={classes.writeMsg}>
                        <input value={text} onChange={(e)=>setText(e.target.value)} type="text" placeholder="Type Your Message" />
                        <label htmlFor="camera">
                          <FontAwesomeIcon icon={faImage} />
                        </label>
                        <input onChange={(e)=>setFiles([...files,...Object.values(e.target.files)])} type="file" multiple id="camera" style={{display:"none"}} />
                        <FontAwesomeIcon icon={faPaperPlane}
                         className={text.length===0&&files.length===0?"":classes.active} 
                         onClick={text.length===0&&files.length===0?null:handelSubmit}
                         />
                     </form>
                   </div>
                </React.Fragment>
                :
                <div className={classes.loader}>
                  <span>Messanger</span>
                  <FontAwesomeIcon icon={faFacebookMessenger} />
                </div>
            }
        </div>
    )
}
export default RightSide;
