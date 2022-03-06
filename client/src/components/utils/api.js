import axios from "axios"
const axiosInstance = axios.create({
    baseURL:"https://facebookeappapi.herokuapp.com/"
})
export default axiosInstance