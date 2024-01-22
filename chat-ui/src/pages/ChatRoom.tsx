import { useContext, useEffect, useState } from "react";
import { Client, Message, over } from 'stompjs';
import SockJS from "sockjs-client";
import { message } from "../types/message.types";
import AuthContext, { } from "../context/authContext";
import ConversationsList from "../component/ConversationsList";
import FriendsList from "../component/FriendsList";
// import FriendRequestsList from "../component/FriendRequestsList";
import StrangersList from "../component/StrangersList";
import Navbar from "../component/Navbar";
import { useWebSocket } from "../context/WebSocketContext";
import MessageList from "../component/MessageList";
const ChatRoom = () => {
    const { auth} = useContext(AuthContext);

    const {sendMessage} = useWebSocket();

    const [message, setMessage] = useState<message>({
       
        senderName: auth.username,
        content: "",
        senderId:""
    });
    const handleMessageChange = (event: any) => {
        const { value } = event.target;
        setMessage({
             
            senderName: auth.username,
            content: value,
            senderId: auth.userId
        });
    }

    return (<div className="chatroom-container">
        <Navbar />
        <div className="chat-box">
            <ConversationsList />
            <div className="chat-content">
                <ul className="chat-messages">
                    <MessageList/>
                </ul>
                <div className="send-message">
                    <input
                        name="message"
                        type="text"
                        className="input-message"
                        placeholder="enter the public message"
                        value={message.content}
                        onChange={handleMessageChange} />
                    <button type="button" className="send-button" onClick={()=>sendMessage(message)}>send</button>
                </div>
            </div>
        </div>
    </div>)
}

export default ChatRoom;