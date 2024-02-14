import { useContext, useEffect, useState } from "react";
import { person } from "../types/person.types";

import BackButton from "../component/BackButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FriendRequest from "../component/FriendRequest";
import { useWebSocket } from "../context/WebSocketContext";

const FriendRequests = () =>{
    const {auth} = useAuth();
    const navigate = useNavigate();
    const {friendRequests, setFriendRequests}= useWebSocket();
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(()=>{
        const fetchFriendRequests = async () =>{
            try{
                const response =  axiosPrivate.get('/getFriendRequests',{
                    headers:{
                        'Authorization': `Bearer ${auth.accessToken}`
                      }
                });
               
                setFriendRequests((await response).data)
            }catch(error){
                console.log(error)
            }
        }
        fetchFriendRequests();
    
        
    },[])

useEffect(()=>{
    console.log(friendRequests)
},[friendRequests])
   
const deleteRequest = (id: string) =>{
    setFriendRequests((prev)=>{
        return prev?.filter((request) => request.id !== id);
    })
}

    return <div className="flex flex-col bg-gray-400 items-center h-screen ">
        <BackButton mobileOnly={false} onCLick={()=>navigate('/app')}/>
        { friendRequests && friendRequests.map((requestData)=>(
          <FriendRequest callback={()=>deleteRequest(requestData.id)} requestData={requestData}/>
        ))}
    </div>
}

export default FriendRequests;