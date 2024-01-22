import { useContext, useEffect, useState } from "react";
import Conversation from "./Conversation";
import AuthenticationContext from "../context/authContext";
import { useWebSocket } from "../context/WebSocketContext";

const ConversationsList = () =>{
    const {auth} = useContext(AuthenticationContext);
    const {setActiveConversation,conversations, fetchConversations} = useWebSocket();

    useEffect(()=>{
        fetchConversations();
    },[])

    return (<div>
        <h4>Conversations list</h4>
        {conversations?.map(conv => <div key={conv.id}><Conversation selectConversation={()=>setActiveConversation(conv.id)} conversation={conv}/></div>)}
    </div>)
}

export default ConversationsList;