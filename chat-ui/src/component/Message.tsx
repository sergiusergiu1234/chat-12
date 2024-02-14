import { useContext, useEffect } from "react";
import { message } from "../types/message.types";
import AuthenticationContext from "../context/authContext";
import { useWebSocket } from "../context/WebSocketContext";
import { FaCheckDouble } from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

interface MessageProps {
    messageData: message,
    isGroupChat: boolean,
    conversationId: string
}

const Message:React.FC<MessageProps> = ({messageData,isGroupChat, conversationId}) =>{
    
    const {auth} = useContext(AuthenticationContext);
    const {stompClient} = useWebSocket();
    useEffect(()=>{
       if(!messageData.seenBy?.includes(auth.userId)){
            try{
                stompClient?.send(`/app/chat/seen-messages/${conversationId}`,{},JSON.stringify({messageId: messageData.id, userId: auth.userId, conversationId: conversationId}));
            }catch(error){
                console.log(error);
            }
       }
    },[])

 

    return  <li key={messageData.id} className={auth.username === messageData.senderName
        ? 'flex flex-row self-end bg-green-700 rounded-md p-1 m-1 '
        : 'flex flex-row self-start w-max bg-amber-900 rounded-md p-1 m-1 '}>
        <div className="flex flex-col ">
            {isGroupChat ? <label className="text-right text-white font-serif text-xs ">{messageData.senderName}</label>
            : <></>}
            
            <div className="max-w-fit  rounded-md items-center justify-center flex" >
                <p className="ml-2 mr-2 mt-0 text-white max-w-[200px] break-words">{messageData.content}</p>
            </div>  
            <div className="flex flex-row justify-end">
                <p className="text-xs flex justify-end">{messageData.timestamp}</p>
                {messageData.seenBy?.length === 2 && <FaCheckDouble className="text-black ml-2 mr-1"/> }
            </div>
           
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