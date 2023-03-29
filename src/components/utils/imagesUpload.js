import setAuthToken from "./setToken";
import axios from "axios";
export const imageUpload =async (images,token) => {
    console.log(images)
    let imgArr = [];
    for(let i=0; i<images.length; i++){
        const fd = new FormData();
        fd.append('file',images[i])
        fd.append("upload_preset","ggimages")
        fd.append("api_key", "372336693865194")
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };
        setAuthToken(null)
        let data = await axios.post("https://api.cloudinary.com/v1_1/dibuevfps/image/upload",fd,config)
        imgArr.push(data.data.url)
    }
    setAuthToken(token)
    return imgArr;
}