import { useContext, useEffect, useState } from "react";
import Button from "../component/Button";
import StrangersList from "../component/StrangersList"
import { FaSearch } from "react-icons/fa";
import { fetchEveryone } from "../api/api";
import AuthenticationContext from "../context/authContext";
import { person } from "../types/person.types";
import Stranger from "../component/Stranger";

const FindPeople = () =>{
    const [strangers,setStrangers] = useState<person[]>();
    const  {auth} = useContext(AuthenticationContext);
    const [username, setUsername] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any>([]);

    useEffect(()=>{
        fetchEveryone(auth.accessToken).then(data=>{
            setStrangers(data);
            console.log(data);
        })
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


    return (<div>
        <h4>Search users</h4>
        <input onChange={handleUsernameChange} value={username} type="text" placeholder={`Search`}></input>


        {filteredUsers?.map((user: person) => (
            <Stranger key={user.id} strangerData={user}/>
        ))}

    </div>)
}
export default FindPeople;