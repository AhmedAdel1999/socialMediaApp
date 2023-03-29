import React,{useState} from "react";
import CommentBody from "../commentbody/commentBody";
import CommentHeader from "../commentheader/commentHeader";
import classes from "./commentreplays.module.css"

const CommentReplay = ({post,commentId,replayId,replays})=>{
    const[next,setNext]=useState(1)
    let AllRep=[]
    const handelReplays = (commentId) =>{
        let commentReplays=[]
        replays.forEach(ele => {
            if(ele.reply===commentId){
                commentReplays.push(ele)
            }
        });
        AllRep=[...commentReplays]
        return commentReplays.slice(0,next);
    }
    return(
        <div className={classes.commentReplays}>
            {
                handelReplays(commentId).map((comment)=>{
                    return(
                        <div className="comment" key={comment._id}>
                            <CommentHeader comment={comment} />
                            <CommentBody comment={comment} post={post} replayId={replayId} />
                        </div>
                    )
                })
            }
            {
                AllRep.length - next > 0
                ? <span
                onClick={() => setNext(next + 10)}>
                    See more replays...
                </span>

                : AllRep.length > 1 &&
                <span
                onClick={() => setNext(1)}>
                    Hide replays...
                </span> 
            }
        </div>
    )
}
export default CommentReplay;