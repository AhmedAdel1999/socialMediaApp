import React, {useState} from "react";
import { useDispatch,useSelector } from "react-redux";
import { commentonpost, getAllPosts } from "../../../features/featchData/postsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import classes from "./inputcomment.module.css"

const InputComment = ({postId,replay,replayId,tag,setReplay}) =>{

    const profileCurrInfo = useSelector((state)=>state.profile.profileCurrInfo)
    const [comment,setComment] = useState('')
    const dispatch = useDispatch();

    const CommentOnPost = async () =>{
        if(replay){
            await dispatch(commentonpost({id:postId,body:{
                text:`${profileCurrInfo.user._id!==tag.user?`@${tag.username}:${comment}`:`${comment}`}`,
                reply:replayId,
                tag:{...tag}}
            }))
            setReplay(false)
        }else{
            await dispatch(commentonpost({id:postId,body:{text:comment}}))
        }
        await dispatch(getAllPosts())
        setComment('')
    }

    return(
        <div className={classes.commentTyping}>
            {replay?
            profileCurrInfo.user._id!==tag.user&&<span>@{tag.username}:</span>
            :
            null
            }
            <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Add Your Comment.." />
            <FontAwesomeIcon icon={faPaperPlane} onClick={()=>CommentOnPost()} />
        </div>
    )
}
export default InputComment;