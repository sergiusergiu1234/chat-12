import { SetStateAction, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { person } from "../types/person.types";

interface RequestProps{
    requestData:person;
    callback: ()=>void;
}

const FriendRequest:React.FC<RequestProps> = ({requestData,callback}) =>{
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [info,setInfo] = useState<person>(requestData);
    const [finalMessage, setFinalMessage] = useState<string>('');
    const handleAcceptRequest = async () =>{
        try{
            const response = axiosPrivate.post(`/sendFriendRequest/${requestData.id}`,{},{
                   headers:{
                       'Authorization': `Bearer ${auth.accessToken}`
                   }
               })
               const data =(await response).data;
                setInfo((prevState) => ({
                 ...prevState,
                 request: data.request
               }));
               setFinalMessage("Request accepted")
           }catch(error){
               console.log(error)
           }
    }

  const handleDeclineFriendRequest = async () =>{
    try{
        const response = axiosPrivate.delete(`/cancelFriendRequest/${requestData.id}`,{
               headers:{
                   'Authorization': `Bearer ${auth.accessToken}`
               }
           })
           const data =(await response).data;
            setInfo((prevState) => ({
             ...prevState,
             request: data.request
           }));
           callback()
           setFinalMessage("Request declined")
       }catch(error){
           console.log(error)
       }

        // cancelFriendRequest(id,auth.accessToken).then(data =>{
        //     if(data.status == 200){
        //         console.log(data.message);
        //         setFriendRequests((prev)=>
        //             prev.filter((request)=> request.id !== id)
        //         )
        //     }
        // })
    }


    return (<div>
    <div className="flex flex-row bg-gray-500 rounded-xl maxsm:w-5/6">
                <label key={requestData.id} className="text-white m-5">
                    Request from: {requestData.username}
                    </label>
                    {finalMessage === '' ?  <div >
                        <button className="w-20 h-8 bg-green-700 m-5 rounded-md hover:bg-green-800"
                        onClick={handleAcceptRequest}>
                        Accept
                    </button>
                    <button className="w-20 h-8 bg-red-700 m-5 rounded-md hover:bg-red-800"
                        onClick={handleDeclineFriendRequest}>
                        Decline
                    </button>
                    </div> : <label className=" flex items-center p-2">{finalMessage}</label>}
                   
                
                </div>
    </div>)
}

export default FriendRequest;