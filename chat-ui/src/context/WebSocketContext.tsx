import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message, over } from 'stompjs';
import AuthenticationContext from './authContext';
import { message } from '../types/message.types';
import Conversation from '../component/Conversation';
import { conversation } from '../types/conversation.types';
import { fetchConv } from '../api/api';

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
  const { auth } = useContext(AuthenticationContext);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<{ [key: string]: message[] }>({});
  const [conversations, setConversations] = useState<conversation[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

  const fetchConversations = async () => {
    try {
      if (auth.accessToken) {
        const data = await fetchConv(auth.accessToken);
        setConversations(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching conversations or establishing connection:', error);
    }
  };
  useEffect(() => {
 
    fetchConversations();
  }, [auth.accessToken]);

  useEffect(() => {
    if(loading === false){
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
      client.connect(headers, ()=> onConnected(client), onError);
    }
  };

  const onConnected = async (client:Client) => {
    console.log('Connected to WebSocketss');
    setStompClient(client);
    // console.log(conversations)
    conversations.map((conversation) => {
      console.log(conversation.id)
      client.subscribe(`/topic/messages/${conversation.id}`, onMessageReceived);
    });
  };

  useEffect(()=>{
    console.log(conversations)
  },[conversations])

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

  const sendMessage = (message: message) => {
    if (message.content !== "") {
      stompClient!.send(`/app/chat/${activeConversation}`, {}, JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ stompClient, sendMessage, messageHistory, activeConversation, setActiveConversation, conversations, fetchConversations }}
      >
      {children}
    </WebSocketContext.Provider>
  );
};