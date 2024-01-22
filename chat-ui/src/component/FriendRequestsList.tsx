import { useContext, useEffect, useState } from "react";
import AuthenticationContext from "../context/authContext";
import { fetchReceivedFriendRequests, fetchSentFriendRequests } from "../api/api";
import { friendRequest } from "../types/friendRequest.types";
import FriendRequest from "./FriendRequest";
import { request } from "http";



const FriendRequestsList = () =>{
    const {auth} = useContext(AuthenticationContext);
    // const [received,setReceived] = useState<friendRequest[]>();
    // const [sent, setSent] = useState<friendRequest[]>();

    // useEffect(()=>{
    //     fetchReceivedFriendRequests(auth.accessToken).then(data => {
    //         setReceived(data);
    //     });

    //     fetchSentFriendRequests(auth.accessToken).then(data=>{
    //         setSent(data);
    //     })
    // },[])
    
    return (<div>
            {/* <h4>Friend Requests</h4>
            <h6>Received requests</h6>
            {received?.map(request=>(
                <FriendRequest  key={request.requestId} friendRequestData={request}/>
            ))}
            <h6>Sent requests</h6>
            {sent?.map(request=>(
                <FriendRequest key={request.requestId} friendRequestData={request}/>
            ))} */}
    </div>)
}

export default FriendRequestsList;