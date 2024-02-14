import { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { message } from "../types/message.types";
import AuthenticationContext from "../context/authContext";

import { IoArrowBackCircleSharp } from "react-icons/io5";
import Message from "./Message";
import BackButton from "./BackButton";
import { conversation } from "../types/conversation.types";
import ConversationMenu from "./ConversationMenu";
import useAuth from "../hooks/useAuth";

interface ConversationData {
    conversation: conversation | undefined
}


const ConversationRoom:React.FC<ConversationData> = ({conversation}) => {

    const { auth } = useAuth();
    const { setActiveConversation, messageHistory, activeConversation } = useWebSocket();
    const [messages, setMessages] = useState<message[]>();
    const [message, setMessage] = useState<message>({
        senderName: auth.username,
        content: "",
        senderId: "",
        timestamp: ''
    });

    const { sendMessage } = useWebSocket();

        const messageContainerRef = useRef<HTMLUListElement>(null);
    const handleMessageChange = (event: any) => {
        const { value } = event.target;
        setMessage({

            senderName: auth.username,
            content: value,
            senderId: auth.userId,
            timestamp: new Date().toISOString(),
        });
    }

    useEffect(() => {
        setMessages(messageHistory[activeConversation]);
        
    }, [messageHistory, activeConversation])

    useEffect(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, [messages]);


    const handleSendMessage = () =>{
        if(message.content.trim() !== ''){
            sendMessage(message);
            setMessage({senderName:auth.username, content:'', senderId: auth.userId, timestamp: new Date().toLocaleString() })
        }
    }

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key === 'Enter'){
            event.preventDefault();
            handleSendMessage();
        }
    }

    return (<>
        <div className={`${activeConversation ? 'flex flex-row bg-gradient-to-r from-slate-800 to-slate-900 w-full h-14' : 'hidden'}  `}>
            <BackButton mobileOnly={true} onCLick={()=>setActiveConversation('')}/>
            <label className="text-white justify-self-end">{conversation?.name}</label>
            {conversation && <ConversationMenu id={conversation?.id} name={conversation?.name} participants={conversation?.participants} isGroupChat={false} messages={[]}/>}
            
        </div>
        <ul ref={messageContainerRef} className="w-4/6 flex flex-col items-center h-5/6 overflow-y-auto custom-scrollbar" >
            {messages?.map((message: message) => (
                <Message key={message.id} messageData={message} conversationId={conversation?.id || ''} isGroupChat={conversation?.isGroupChat || false}/>
            ))}
        </ul>

        <div className="m-10 flex items-center w-5/6">
  <input
    name="message"
    type="text"
    className="p-2 border-2 border-gray-800 rounded-md w-full mr-2 focus:outline-none"
    placeholder="Enter your message"
    value={message.content}
    onChange={handleMessageChange}
    onKeyUpCapture={handleEnterKeyPress}
  />
  <button
    type="button"
    className="send-button px-4 py-2 border-2 border-gray-800 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
    onClick={handleSendMessage}
    disabled={message.content.trim() === ""}
  >
    Send
  </button>
</div>
    </>)
}

export default ConversationRoom;