import { useContext, useEffect, useState } from "react";
import { createConversation, fetchEveryone, fetchFriends } from "../api/api";
import AuthenticationContext from "../context/authContext";
import { person } from "../types/person.types";
import Friend from "./Friend";
import Button from "./Button";
import { plainPerson } from "../types/plainPerson.types";
import { useNavigate } from "react-router-dom";




const NewGroup = () => {
    const { auth } = useContext(AuthenticationContext);
    const [friends, setFriends] = useState<person[]>([])
    const [checkedFriends, setCheckedFriends] = useState<plainPerson[]>([{id: auth.userId, username: auth.username}]);
    const [groupName,setGroupName] = useState<string>("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchFriends(auth.accessToken).then(data => {
            setFriends(data)
        })
    }, []);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createConversation(auth.accessToken, checkedFriends,true,groupName).then((data) => {
            if(data.status === 200){
                navigate(-1);
            }
        })
    }

    const handleCheckboxChange = (friend: plainPerson) => {
        setCheckedFriends((prevChecked) => {
            if (prevChecked.includes(friend)) {
                return prevChecked.filter((fr) => fr.id !== friend.id);
            } else {
                return [...prevChecked, friend];
            }
        });
    };

    const handleNameChange = (e:any) =>{
        setGroupName(e.currentTarget.value);
    }
    return (<div>
        <h4>Friends list</h4>
        <form onSubmit={handleSubmit}>
            {friends.map(
                (friend) => (<div><Friend key={friend.id}
                    friendData={friend} />
                    <input type="checkbox" checked={checkedFriends.includes(friend)}
                        onChange={() => handleCheckboxChange(friend)} />
                </div>
                ))}
                <input type="text" onChange={handleNameChange} value={groupName}></input>
            <Button disabled={checkedFriends.length === 1 && groupName === null} type="submit">Create group</Button>
        </form>


    </div>)
}

export default NewGroup;