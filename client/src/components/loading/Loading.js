import FadingBalls from "react-cssfx-loading/lib/FadingBalls"
const Loading = () =>{
    return(
        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            width:"100%",
            height:"100vh",
        }}>
            <FadingBalls color="#FF0000" width="15px" height="15px" duration="3s" />
        </div>
    )
}
export default Loading