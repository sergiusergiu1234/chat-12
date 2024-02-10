import React, { createContext, useContext, useState, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message, over } from 'stompjs';
import { message } from '../types/message.types';
import Conversation from '../component/Conversation';
import { conversation } from '../types/conversation.types';
// import { fetchConv, fetchReceivedFriendRequests } from '../api/api';
import { friendRequest } from '../types/friendRequest.types';
import { person } from '../types/person.types';
import AuthenticationContext from './authContext';
import { axiosPrivate } from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useRefreshToken from '../hooks/useRefreshToken';

declare module 'stompjs' {
  interface Message {
    headers: {
      destination: string;
    }
  }
}
interface WebSocketContextProps {
  stompClient: Client | null;
  sendMessage: (message: message) => void;
  messageHistory: {[ConversationId: string]: message[]};
  activeConversation: string;
  setActiveConversation : (conversationId: string) => void;
  conversations: conversation[];
  fetchConversations: () => void;
  leaveConversation: (conversationId:string) => void;

  searchVal : string | undefined;
  setSearchVal: Dispatch<SetStateAction<string | undefined>>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = (): WebSocketContextProps => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};


type WebSocketProviderProps ={
    children: React.ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { auth} = useContext(AuthenticationContext);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<{ [key: string]: message[] }>({});
  const [conversations, setConversations] = useState<conversation[]>([]);
  const [loading,setLoading] = useState<boolean>(true);
  const [friendRequests, setFriendRequests] = useState<person[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const [searchVal, setSearchVal] = useState<string | undefined>(undefined);

 
  const fetchConversations = async () => {
    try{
      const response = axiosPrivate.get('/getConversations',{
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      })
      console.log("conversations:",(await response).data);
      setConversations((await response).data)
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  };


  useEffect(() => {
    if(!loading && conversations && auth){
      
      console.log("Fetching conversations ...")
      conversations.forEach((conversation) => {
        setMessageHistory((prev) => ({
          ...prev,
          [conversation.id]: conversation.messages,
        }));
      });
      establishConnection().then((client)=>connectToWebSocket(client));
    }
  }, [loading]);

  const establishConnection = async () => {
    console.log('Establishing connection...');
    let Sock = new SockJS('http://localhost:8080/chat');
    const temp = over(Sock);
    return temp;
  };

  const connectToWebSocket = async (client:Client) => {
    console.log('Connecting to WebSocket...');
    if (client) {
      const headers = { Authorization: `Bearer ${auth.accessToken}` };
      console.log("headers to connect to ws",headers)
      
      client.connect(headers, ()=> onConnected(client), onError);
    }
  };

  const onConnected = async (client:Client) => {
    console.log('Connected to WebSocketss');
    setStompClient(client);

    //friend requests websocket subscription
      client.subscribe(`/user/queue/friend-requests`,onFriendRequestReceived)
    

    conversations.map((conversation) => {
      console.log(conversation.id)
      client.subscribe(`/topic/messages/${conversation.id}`, onMessageReceived);
    });
  };



  const onError = (err: any) => {
    console.error('WebSocket connection error:', err);
    localStorage.removeItem('access');
  };

  const onMessageReceived = (message: Message) => {
    const destinationParts = message.headers.destination.split('/');
    const destination = destinationParts[destinationParts.length - 1];
    setMessageHistory((prev) => ({
      ...prev,
      [destination]: [...(prev[destination] || []), JSON.parse(message.body)],
    }));
  };

  const onFriendRequestReceived = (message:Message) =>{
    const friendRequest = JSON.parse(message.body);
    console.log(friendRequest)
    setFriendRequests(prev=>([
      ...prev , friendRequest
    ]))
  }


  const sendMessage = (message: message) => {
    if (message.content !== "") {
      stompClient!.send(`/app/chat/${activeConversation}`, {}, JSON.stringify(message));
    }
  };
  const leaveMessage = {
    token: auth.accessToken,
};
  const leaveConversation = (conversationId:string)=>{
    stompClient?.send(`/app/chat/${conversationId}/leave`, {}, JSON.stringify(leaveMessage));
  }

  return (
    <WebSocketContext.Provider
      value={{ stompClient, sendMessage, messageHistory, activeConversation, setActiveConversation, 
        conversations, fetchConversations ,leaveConversation, searchVal, setSearchVal}}
      >
      {children}
    </WebSocketContext.Provider>
  );
};