import { useContext, useEffect, useState } from "react"
import AuthenticationContext from "../context/authContext"
import { cancelFriendRequest, sendFriendRequest } from "../api/api"
import { friendRequest } from "../types/friendRequest.types"
import { person } from "../types/person.types"

interface StrangerProps {
    strangerData:person
}
const Stranger: React.FC<StrangerProps> = ({ strangerData }) => {
    const { auth } = useContext(AuthenticationContext);
    const [loading, setLoading] = useState(false);
    const [info,setInfo] = useState<person>(strangerData);
    


    const handleSendFriendRequest = async () => {
        if(loading) return;
        setLoading(true);
        sendFriendRequest(auth.accessToken, strangerData.id).then(data =>{
            if(data.status == 200){
                console.log(data.message);

                setInfo(prevState => ({
                    ...prevState, request: data.message
                }))
            }
            setLoading(false);
        });
    }


    const handleCancelFriendRequest = () =>{
        cancelFriendRequest(strangerData.id,auth.accessToken).then(data =>{
            if(data.status == 200){
                console.log(data.message);
                setInfo(prevState => ({
                    ...prevState, request:null
                }))
            }
        })
    }

    return (<div>
        {(strangerData.id === auth.userId)
            ?
            null
            :
            <div>
                <label>{strangerData.username}</label>
                <img alt={`image of user ${strangerData.username}`}></img>

                {info.request === null ?(info.friends === true ? <></> :  <button onClick={handleSendFriendRequest}>Send friend request</button>)
                 :
                 <>{info.request.receiverId == auth.userId ?  <button onClick={handleSendFriendRequest}>Accept friend request</button> 
                 :
                 <button onClick={handleCancelFriendRequest}>Cancel friend request</button>}</>}        
            </div>}
    </div>

    )
}

export default Stranger;