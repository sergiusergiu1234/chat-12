import { useContext, useState } from "react";
import { LuMoreVertical } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { conversation } from "../types/conversation.types";
import { person } from "../types/person.types";
import { IoMdRemoveCircle } from "react-icons/io";
import { useClickOutside } from "../hooks/useClickOutside";
// import AuthenticationContext from "../context/authContext";
import { useWebSocket } from "../context/WebSocketContext";



const ConversationMenu = ({id,name,participants}:conversation) => {
    // const {auth} = useContext(AuthenticationContext);
    const [toggle,setToggle] = useState(false);
    const [toggleParticipants, setToggleParticipants] = useState<boolean>(false);
    const {leaveConversation} = useWebSocket();
    const ref=useClickOutside(()=>{
        setToggle(false);
    })

    const handleLeaveGroup = () =>{
        leaveConversation(id)
    }


 

    return (<div ref={ref}>
        <button onClick={()=>setToggle(!toggle)} className="bg-gray-900 text-white"> <LuMoreVertical /></button>

        <div className="">
            <ul  className={`${toggle ? 'absolute w-1/2' : 'hidden'} `}>
            <li className="w-1/2">
                <div className="flex flex-col ">
                    <button
                    className=" border-2 p-2 flex  w-full bg-gray-500  border-solid text-white font-bold hover:bg-gray-700 hover: rounded-md duration-500"
                    onClick={()=>setToggleParticipants(!toggleParticipants)}>
                        <FaPeopleGroup />
                        View participants
                    </button>
                    {toggleParticipants &&
                    <ul className="bg-gray-500">
                        {participants.map((participant:person)=>{
                            return <li className="flex flex-row items-center border-black w-9/12" key={participant.id}>
                                <img className="rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2" alt={`profilePhoto of ${participant.username}`} ></img>
                                <label>{participant.username}</label>
                                
                            </li>
                        })}
                    </ul>}
                </div>
            <button
            onClick={handleLeaveGroup}
                 className={`border-2 p-2 flex  w-full bg-gray-500  border-solid text-red-600 font-bold hover:bg-gray-700 hover: rounded-md duration-500`}>
                Leave group
            </button>
    
            </li>
            </ul>
        </div>
    
    </div>)
}

export default ConversationMenu;

function useOutsideClick(arg0: () => void) {
    throw new Error("Function not implemented.");
}
