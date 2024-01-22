import { useContext, useEffect, useState } from "react";
import { person } from "../types/person.types";
import AuthenticationContext from "../context/authContext";
import { friendRequest } from "../types/friendRequest.types";
import {  cancelFriendRequest } from "../api/api";

interface FriendRequestInterface {
    friendRequestData:friendRequest
}

const FriendRequest:React.FC<FriendRequestInterface> = ({friendRequestData}) =>{
    // const {auth} = useContext(AuthenticationContext);
    // const [active,setActive] = useState<boolean>(true);
    // const [accepted,setAccepted] = useState<boolean>(false);
    // const cancelSentRequest = () =>{
    //     cancelFriendRequest(friendRequestData.receiver.id,auth.accessToken).then(data =>{
    //         if(data.status == 200){
    //             setActive(false);
    //         }
    //     })
    // }
    // useEffect(()=>{
    //     console.log(friendRequestData)
    // },[])
    // const declineRequest = () =>{
    //     cancelFriendRequest(friendRequestData.sender.id,auth.accessToken).then(data =>{
    //         if(data.status == 200){
    //             setActive(false);
    //         }
    //     })
    // }

    // const acceptRequest =  () =>{
    //     acceptFriendRequest(friendRequestData.requestId, auth.accessToken).then(data=>{
    //         if(data.status == 200){
    //             setActive(false);
    //             setAccepted(true);
    //         }
    //     })
    // }

    return (<div>
        {/* {auth.userId === friendRequestData.receiver.id
         ?
             <>
             <label>{friendRequestData.sender.username}</label>
             <img alt={`image of user ${friendRequestData.sender.id}`}></img>
             {accepted ? <label>Accepted</label> : <>
             {active ? <>
                <button onClick={acceptRequest}>Accept</button>
             <button disabled={!active} onClick={declineRequest}>{active ? "Decline" : "Declined"} </button></> : <label>Declined</label>}
             </> }
             
             
             </>
              : 
              <>
              <label>{friendRequestData.receiver.username}</label>
              <img alt={`image of user ${friendRequestData.receiver.id}`}></img>
              <button disabled={!active} onClick={cancelSentRequest}>{active ? "Cancel request" : "canceled"}</button>
              </>} */}
    </div>)
}

export default FriendRequest;