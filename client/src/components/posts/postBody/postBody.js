import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import classes from "./postBody.module.css"
const PostBody = ({post}) =>{
    const settings = {
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
    return(
        <div className="postBody">
            <p className={classes.postText}>{post.text}</p>
            {
                post.imgs.length>0&&
                <div className={classes.postImgs}>
                    {
                        post.imgs.length===1?
                        <div className={classes.postImg}>
                            <img alt="" src={post.imgs[0]} />
                        </div>
                        :
                        <Slider {...settings}>
                            {
                                post.imgs.map((x,ind)=>{
                                    return(
                                        <div key={ind}>
                                            <img alt="" src={x} />
                                        </div>
                                    )
                                })
                            }  
                        </Slider>
                    }
                </div>
            }
        </div>
    )
}
export default PostBody
