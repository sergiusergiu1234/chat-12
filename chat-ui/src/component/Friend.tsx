import { useEffect, useState } from "react"
import { person } from "../types/person.types";

interface FriendProps {
    friendData: person;

}

const Friend:React.FC<FriendProps> = ({friendData}) =>{

    return (<div className="flex flex-row items-center  p-1 ">
        
      <img className="rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2" alt={`profilePhoto of ${friendData.username}`} ></img>
      <label className="text-lg ">{friendData.username}</label>
    </div>)
}

export default Friend;