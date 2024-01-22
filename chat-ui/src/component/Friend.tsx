import { useEffect, useState } from "react"
import { person } from "../types/person.types";
import Button from "./Button";

interface FriendProps {
    friendData: person;

}

const Friend:React.FC<FriendProps> = ({friendData}) =>{

    return (<div>

        <label>{friendData.username}</label>
      <img alt={`profilePhoto of ${friendData.username}`} ></img>

    </div>)
}

export default Friend;