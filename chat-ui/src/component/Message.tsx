import { useContext, useEffect } from "react";
import { message } from "../types/message.types";
import AuthenticationContext from "../context/authContext";
import { useWebSocket } from "../context/WebSocketContext";

interface MessageProps {
    messageData: message,
    isGroupChat: boolean
}

const Message:React.FC<MessageProps> = ({messageData,isGroupChat}) =>{
    
    const {auth} = useContext(AuthenticationContext);
    useEffect(()=>{

    },[])

 

    return  <li key={messageData.id} className={auth.username === messageData.senderName
        ? 'flex flex-row self-end bg-green-700 rounded-md p-1 m-1 '
        : 'flex flex-row self-start w-max bg-gray-800 rounded-md p-1 m-1 '}>
        <div className="flex flex-col ">
            {isGroupChat ? <label className="text-right text-white font-serif text-xs ">{messageData.senderName}</label>
            : <></>}
            
            <div className="max-w-fit border-t-red-800 border-x-2 rounded-md items-center justify-center flex" >
                <p className="m-3 mt-0 text-white max-w-[200px] break-words">{messageData.content}</p>
            </div>  
            <p className="text-xs flex justify-end">{messageData.timestamp && formatTimestamp(messageData.timestamp)}</p>
            </div>
    </li>
}

export default Message;


export const formatTimestamp = (timestamp:string)=>{
    const date= new Date(timestamp);
    const hours =date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}