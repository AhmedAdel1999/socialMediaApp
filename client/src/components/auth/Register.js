import React, { useEffect } from "react";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { register,clearUserState } from "../../features/featchData/userSlice";
import { useDispatch,useSelector } from 'react-redux';
import { useHistory,Link } from "react-router-dom";
import Loading from "../loading/Loading";
import ErrorMsg from "../utils/errorMsg";
import * as Yup from "yup";
import classes from  "./auth.module.css"

const Register = () => {
  
  const dispatch  = useDispatch();
  const history = useHistory();
  const {isError,isSuccess,errorMsg,isLoading} = useSelector((state)=>state.user)
  useEffect(()=>{
    dispatch(clearUserState())
  },[])

  useEffect(()=>{
    if(isSuccess){
      history.push("/")
    }
  },[isError,isSuccess])

  const onSubmit = (values)=>{
     dispatch(register(values))
  }
  const schema = () =>{
    const schema = Yup.object().shape({
      email:Yup.string().email("email must be like this example@gmail.com").required("required"),
      username:Yup.string().min(2, 'Too Short!').required("required"),
      fullname:Yup.string().min(2, 'Too Short!').required("required"),
      password:Yup.string().min(6, 'Too Short!').required("required"),
    })
    return schema
  }
  if(isLoading){
    return <Loading />
  }
  return (
    <div className={classes.auth}>
        <div className={classes.authContent}>
          <div className={classes.authHeader}>
            <span><FontAwesomeIcon icon={faLock} /></span>
            <span>Register</span>
          </div>
          {
            isError&&
            <ErrorMsg msg={errorMsg} />
          }
          <Formik 
            initialValues={{
            email:"",
            username:"",
            fullname:"",
            password:"",
            }}
            onSubmit={onSubmit}
            validationSchema={schema}
          >
            <Form className={classes.formData}>
              <div className={classes.field}>
                <label>Email*</label>
                <Field type="email" name="email" placeholder="Email*" />
                <ErrorMessage name="email" component="span" />
              </div>

              <div className={classes.field}>
                <label>Username*</label>
                <Field type="text" name="username" placeholder="Username*" />
                <ErrorMessage name="username" component="span" />
              </div>

              <div className={classes.field}>
                <label>Fullname*</label>
                <Field type="text" name="fullname" placeholder="FullName*" />
                <ErrorMessage name="fullname" component="span" />
              </div>

              <div className={classes.field}>
                <label>Password*</label>
                <Field type="password" name="password" placeholder="Password*" />
                <ErrorMessage name="password" component="span" />
              </div>
              
              <button className={classes.submit} type="submit">Register</button>
            </Form>
          </Formik>
          <div className={classes.redirect}>
              <span>Already have account?</span>
              <span><Link to="/">Login</Link></span>
          </div>
        </div>
    </div>
  );
}

export default Register;