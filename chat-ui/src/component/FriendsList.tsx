import { useContext, useEffect, useState } from "react";
import { createConversation, fetchEveryone, fetchFriends } from "../api/api";
import AuthenticationContext from "../context/authContext";
import { person } from "../types/person.types";
import Friend from "./Friend";
import Button from "./Button";




const FriendsList = () => {
    const { auth } = useContext(AuthenticationContext);
    const [friends, setFriends] = useState<person[]>([])
    const [checkedFriends, setCheckedFriends] = useState<string[]>([auth.userId]);
    
    useEffect(() => {
        fetchFriends(auth.accessToken).then(data => {
            setFriends(data)
        })
    }, []);



    return (<div>
        <h4>Friends list</h4>
       
            {friends.map(
                (friend) => (<Friend key={friend.id}
                    friendData={friend} />))}
    
    </div>)
}

export default FriendsList;