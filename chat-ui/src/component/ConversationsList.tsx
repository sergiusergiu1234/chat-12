import { useContext, useEffect, useState } from "react";
import Conversation from "./Conversation";
import { useWebSocket } from "../context/WebSocketContext";

import { conversation } from "../types/conversation.types";



const ConversationsList = () => {

  const { setActiveConversation, conversations, fetchConversations , searchVal } =useWebSocket();

  useEffect(() => {
    fetchConversations();   
  }, []);

  const [filteredConversations, setFilteredConversations] = useState<conversation[]>(conversations);


  useEffect(()=>{
    if(searchVal !== undefined){
      setFilteredConversations(conversations.filter((conv)=>{
        return conv.name?.includes(searchVal);
      }))
    }else{
      setFilteredConversations(conversations);
    }
  },[searchVal,conversations])

  return (
    <div className="flex flex-col">

      {filteredConversations?.map((conv) => (
        <Conversation
          key={conv.id}
          selectConversation={() =>{
              conv.name && localStorage.setItem('activeConvName', conv.name);
              console.log(conv)
              setActiveConversation(conv.id)}}
          conversation={conv}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
