import { useContext, useEffect, useState } from "react";

import AuthenticationContext from "../context/authContext";
import { person } from "../types/person.types";
import Friend from "./Friend";





const FriendsList = () => {

    const [friends, setFriends] = useState<person[]>([])

    
    useEffect(() => {
        // fetchFriends(auth.accessToken).then(data => {
        //     setFriends(data)
        // })
    }, []);



    return (<div>
        <h4>Friends list</h4>
       
            {friends.map(
                (friend) => (<Friend key={friend.id}
                    friendData={friend} />))}
    
    </div>)
}

export default FriendsList;