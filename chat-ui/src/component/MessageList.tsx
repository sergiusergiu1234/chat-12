import { FC, useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { message } from "../types/message.types";


const MessageList = () =>{
    const {messageHistory,activeConversation} = useWebSocket();
    const [messages,setMessages] = useState<message[]>();
  
    useEffect(()=>{
        setMessages(messageHistory[activeConversation]);
    },[messageHistory,activeConversation])

    return (<div>
        {messages?.map((message:message,index:number)=>(
            <div key={index}>
            <p>{message.senderName}: {message.content}</p>
            </div>

        ))}
    </div>)
}

export default MessageList;