import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'
import { useToasts } from "react-toast-notifications"
import { imageUpload } from "../../utils/imagesUpload";
import { useDispatch,useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes,faImage,faPlus } from "@fortawesome/free-solid-svg-icons";
import { Postpost, updatePost,getAllPosts } from "../../../features/featchData/postsSlice";
import Spin from "react-cssfx-loading/lib/Spin"
import classes from "./createpost.module.css"


const Createpost = ({showModal,setShowModal,id}) =>{
    const token = useSelector((state)=>state.user.token)
    const {allPosts,isLoading} = useSelector((state)=>state.posts)
    const { addToast:notify } = useToasts()
    const [files,setFiles]=useState([])
    const [Edit,setEdit]=useState(false)
    const [text,setText]=useState('')
    const dispatch=useDispatch()

    useEffect(()=>{
      if(id!==null){
        setFiles(allPosts.filter((x)=>x._id===id)[0].imgs)
        setText(allPosts.filter((x)=>x._id===id)[0].text)
        setEdit(true)
      }
      dispatch(getAllPosts())
    },[id,showModal])

    const filterImgs = (index) =>{
        setFiles(files.filter((x,ind)=>ind!==index))
   }
    const createPost =async () =>{
        let imgs=[]
        if(files.length>0){
            imgs=[...files.filter((x)=>typeof(x)!=="object")]
            let data = await imageUpload([...files.filter((x)=>typeof(x)==="object")],token)
            imgs=[...imgs,...data]
        }
       if(Edit){
           await dispatch(updatePost({id:id,body:{text,imgs}}))
       }else{
           if(text.length===0&&imgs.length===0){
            notify(`Sorry!! But You Have To Write Text OR Upload Image`,
            {appearance: 'warning',autoDismiss:"true"})
           }else{
            await dispatch(Postpost({text,imgs}))
           }
       }
       setShowModal(false)
       setText('')
       setFiles([])
    }
    return(
        <div>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <div className={classes.postHead}>
                    <div>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>add your post</span>
                    </div>
                    <FontAwesomeIcon onClick={() => setShowModal(false)} icon={faTimes} />
                </div>
                <div className={classes.postBody}>
                    <textarea value={text} 
                        onChange={(e)=>setText(e.target.value)} 
                        placeholder="what is happen?" 
                    />
                    {
                        files.length>0&&
                        <div className={classes.postImgs}>
                            {
                                files.map((x,index)=>{
                                    return(
                                        <div className={classes.imgItem} key={index}>
                                            <img src={Edit?`${typeof(x)==="object"?URL.createObjectURL(x):x}`:`${URL.createObjectURL(x)}`}/>
                                            <FontAwesomeIcon onClick={()=>filterImgs(index)} icon={faTimes} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className={classes.postFooter}>
                    <label htmlFor="imgs">
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input type="file" multiple id="imgs" style={{display:"none"}}
                     onChange={(e)=>setFiles(files.concat(Object.values(e.target.files)))} />
                    <button onClick={()=>createPost()}>
                        {Edit?
                        <React.Fragment>
                            <span>update post</span>
                            {
                                isLoading&&
                                <Spin color="#FF0000" width="20px" height="20px" duration="3s" />
                            }
                            
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <span>create post</span>
                            {
                                isLoading&&
                                <Spin color="#FF0000" width="20px" height="20px" duration="3s" />
                            }
                        </React.Fragment>
                        }
                    </button>
                </div>
            </Modal>
        </div>
    )
}
export default Createpost