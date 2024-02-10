import { useContext, useEffect, useState } from "react";

import { person } from "../types/person.types";
import Stranger from "../component/Stranger";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import BackButton from "../component/BackButton";
import { useNavigate } from "react-router-dom";

const FindPeople = () =>{
    const [strangers,setStrangers] = useState<person[]>();
    const  {auth} = useAuth();
    const [username, setUsername] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchEveryone = async () =>{
            try{
                const response =  axiosPrivate.get('/users',{
                    headers:{
                        'Authorization': `Bearer ${auth.accessToken}` 
                    }
                });

                setStrangers((await response).data)
            }catch(error){
                console.log(error)
            }
        }
        fetchEveryone();
   
    },[])

    const handleUsernameChange =(e:React.ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.currentTarget.value);
      
    }

    useEffect(()=>{
        const filtered = strangers?.filter((user:person)=>{
          return  user.username.toLowerCase().includes(username.toLowerCase()) 
        })    

        if(username.length === 0){
            setFilteredUsers([]);
        }else{
            setFilteredUsers(filtered);
        }
        
     },[username])


    return (<div className="flex flex-col bg-gray-400 items-center h-screen ">
        <BackButton mobileOnly={false} onCLick={()=>navigate('/app')}/>
        <h2 className="m-5">Search users</h2>
        <input className="bg-gray-800 w-72 rounded-md p-3 text-white" onChange={handleUsernameChange} value={username} type="text" placeholder={`Search`}></input>


        {filteredUsers?.map((user: person) => (
            <Stranger key={user.id} strangerData={user}/>
        ))}

    </div>)
}
export default FindPeople;