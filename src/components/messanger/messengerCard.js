import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LeftSide from "./leftSide";
import RightSide from "./rightSide";
import { useMediaQuery } from "react-responsive";
import classes from "./messanger.module.css"

const Messenger = () =>{
    const toggleSides = useMediaQuery({maxWidth:767})
    const[cardHeight,setCardHeight]=useState(`100vh`)
    const {id} = useParams()
    useEffect(()=>{
        setCardHeight(`${window.innerHeight-81}px`)
    },[])
    return(
        <div className={classes.messangerCard} style={{height:cardHeight}}>
            {
                toggleSides?
                id?<RightSide convId={id} />:<LeftSide />
                :
                <React.Fragment>
                    <LeftSide />
                    <RightSide convId={id} />
                </React.Fragment>
            }
        </div>
    )
}
export default Messenger;