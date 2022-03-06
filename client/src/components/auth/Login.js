import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field , ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { login } from "../../features/featchData/userSlice";
import { useDispatch,useSelector } from 'react-redux';
import Loading from "../loading/Loading";
import ErrorMsg from "../utils/errorMsg";
import * as Yup from "yup";
import classes from "./auth.module.css"

const Login = () => {

  const dispatch  = useDispatch();
  const {isError,errorMsg,isLoading} = useSelector((state)=>state.user)


  const onSubmit = (values)=>{
    dispatch(login(values))
  }
  const schema = () =>{
    const schema = Yup.object().shape({
      email:Yup.string().email("email must be like this example@gmail.com").required("required"),
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
            <span>Login</span>
          </div>
          {
            isError&&
            <ErrorMsg msg={errorMsg} />
          }
          <Formik 
            initialValues={{
            email:"",
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
                <label>Password*</label>
                <Field type="password" name="password" placeholder="Password*" />
                <ErrorMessage name="password" component="span" />
              </div>
              
              <button className={classes.submit} type="submit">Login</button>
            </Form>
          </Formik>
          <div className={classes.redirect}>
              <span>Do You have account?</span>
              <span><Link to="/register">Register</Link></span>
          </div>
        </div>
    </div>
  );
}

export default Login;