import { useContext, useEffect, useState } from "react";
import { person } from "../types/person.types";

import BackButton from "../component/BackButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FriendRequest from "../component/FriendRequest";

const FriendRequests = () =>{
    const {auth} = useAuth();
    const navigate = useNavigate();
    const [friendRequests, setFriendRequests]= useState<person[]>();
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
   

    return <div className="flex flex-col bg-gray-400 items-center h-screen ">
        <BackButton mobileOnly={false} onCLick={()=>navigate('/app')}/>
        { friendRequests && friendRequests.map((requestData)=>(
          <FriendRequest requestData={requestData}/>
        ))}
    </div>
}

export default FriendRequests;