import React, { useState,useEffect } from "react";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import {useToasts} from "react-toast-notifications"
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { updateuser } from "../../features/featchData/userSlice";
import { getCurrprofile, updateProfile,clearProfState, getAllProfiles } from "../../features/featchData/profileSlice";
import setAuthToken from "../utils/setToken";
import Ring from "react-cssfx-loading/lib/Ring"
import ErrorMsg from "../utils/errorMsg";
import axios from "axios";
import * as Yup from "yup";
import classes from "./editprofile.module.css"


const EditProfile = () => {
    const {profileCurrInfo,isError,isSuccess,isLoading,errorMsg} = useSelector((state)=>state.profile)
    const token = useSelector((state)=>state.user.token)
    const [file,setFile] = useState(null)
    const [update,setUpdate] = useState(false)
    const dispatch  = useDispatch();
    const history = useHistory()
    const { addToast:notify } = useToasts()

    useEffect(()=>{
      setAuthToken(token)
      dispatch(getCurrprofile())
    },[update])

    useEffect(()=>{
      dispatch(clearProfState())
    })

    useEffect(()=>{
      const fun = async () =>{
          await dispatch(getCurrprofile())
          await dispatch(getAllProfiles())
          await dispatch(clearProfState())
          history.push("/")
      }
      if(isSuccess){
        fun();
      }
    },[isError,isSuccess])
  const onSubmit = async(values)=>{
    let {email,username,fullname,bio,password,profileImg} = values
    try {
        if(file){
            const fd = new FormData();
            fd.append('file',file)
            fd.append("upload_preset","ggimages")
            fd.append("api_key", "372336693865194")
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
            setAuthToken(null)
            await axios.post("https://api.cloudinary.com/v1_1/dibuevfps/image/upload",fd,config).then((res)=>{
                console.log(res)
            profileImg=res.data.url
            });
            setAuthToken(token)
        }
        await dispatch(updateuser({id:profileCurrInfo.user._id,
            data:{email,username,password,_id:profileCurrInfo.user._id}
        }))
        await dispatch(updateProfile({name:fullname,bio,profileImg}))
        setUpdate(!update)
    } catch (error) {
      notify(`${error}`,
      {appearance: 'error',autoDismiss:"true"})
    }
  }
  const schema = () =>{
    const schema = Yup.object().shape({
      email:Yup.string().email("email must be like this example@gmail.com"),
      username:Yup.string().min(2, 'Too Short!'),
      fullname:Yup.string().min(2, 'Too Short!'),
      bio:Yup.string().min(10, 'Too Short!').max(50,'Too Much'),
      password:Yup.string().min(6, 'Too Short!')
    })
    return schema
  }
  const CustomInputComponent = () => (
    <input type="file" id="img" style={{display:"none"}}
    onChange={(e)=>setFile(e.target.files[0])}
    />
  );
  return (
    <div className={classes.editSection}>
       <Formik 
         initialValues={{
         email:`${profileCurrInfo.user.email}`,
         username:`${profileCurrInfo.user.username}`,
         fullname:`${profileCurrInfo.name}`,
         bio:`${profileCurrInfo.bio}`,
         password:"",
         profileImg:`${profileCurrInfo.profileImg}`,
        }}
         onSubmit={onSubmit}
         validationSchema={schema}
       >
         <Form className={classes.formData}>
           <div className={classes.imgBox}>
              <label htmlFor="img" className={classes.imgUpload}>
                <img src={file?`${URL.createObjectURL(file)}`:`${profileCurrInfo.profileImg}`}/>
              </label>
           </div>
           <Field as={CustomInputComponent} name="profileImg" />

           {
            isError&&
            <ErrorMsg msg={errorMsg} />
           } 

           <div className={classes.field}>
              <label>Email*</label>
              <Field type="email" name="email" placeholder="Email*" />
              <ErrorMessage name="email" component="div" />
           </div>

           <div className={classes.field}>
              <label>Username*</label>
              <Field type="text" name="username" placeholder="Username*" />
              <ErrorMessage name="username" component="span" />
           </div>

           <div className={classes.field}>
              <label>Fullname*</label> 
              <Field type="text" name="fullname" placeholder="Fullname*" />
              <ErrorMessage name="fullname" component="span" />
           </div>

           <div className={classes.field}>
              <label>Bio*</label>
              <Field type="text" name="bio" placeholder="Bio*" />
              <ErrorMessage name="bio" component="span" />
           </div>

           <div className={classes.field}>
              <label>Password*</label>
              <Field type="password" name="password" placeholder="Password*" />
              <ErrorMessage name="password" component="span" />
           </div>

           <button className={classes.submit} type="submit">
             <span>Update Profile</span>
             {
               isLoading&&
               <Ring color="#FFF" width="25px" height="25px" duration=".5s" />
             }
           </button>
         </Form>
       </Formik>
    </div>
  );
}

export default EditProfile;
