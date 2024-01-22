import { useContext } from "react";
import AuthenticationContext from "../context/authContext";
import { plainPerson } from "../types/plainPerson.types";
import { registerData } from "../types/registerData.types";

export const API_URL = 'http://localhost:8080';


export const fetchEveryone = async (token: string) =>{
  const url = "/users";
  const response = await fetch(url,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
}
export const fetchFriends = async (token:string) =>{
    const url= `/getFriends`;
    const  response = await fetch(url,{
        method: 'GET',
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
    const data = await response.json();
    return data;
}

export const fetchConv= async (token:string) =>{
    const url= `/getConversations`;
    const  response = await fetch(url,{
        method: 'GET',
        headers:{
          'Authorization': `Bearer ${token}`,
          
        }
      });
    const data = await response.json();
    return data;
}
export const sendFriendRequest = async (token:string,receiverID:string) =>{
  const url= `/sendFriendRequest/${receiverID}`;
  const response = await fetch(url, {
    method: 'POST',
    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  const status = response.status;
  const message = await response.json();
  return {status,message};
}

export const fetchReceivedFriendRequests = async (token:string) =>{
  const url ="/getFriendRequests";
  const response = await fetch(url,{
    method: 'GET',
    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

export const fetchSentFriendRequests = async (token:string) =>{
  const url ="/getSentFriendRequests";
  const response = await fetch(url,{
    method: 'GET',
    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

export const cancelFriendRequest = async (id:string, token: string)=>{
  const url =`/cancelFriendRequest/${id}`;
  const response = await fetch(url,{
    method: 'DELETE',
    headers:{
      'Authorization': `Bearer ${token}`
    }
  });
  const status = response.status;
  const message = await response.json();
 
  return{status, message};
}

export const createConversation = async (token:string, participants:plainPerson[], isGroup:boolean,name:string | undefined) =>{
const url = '/createConversation';
const response = await fetch(url,{
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    participants: participants,
    isGroupChat: isGroup,
    name: name
  })}
);
const status = response.status;
const message = await response.json();

return {status,message};
} 


export const registerUser = async ( registerData : registerData)=>{
  const url ="/api/v1/auth/register";
  console.log('Registerdata:', registerData);
  const response = await fetch(url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerData)
  })
  const status = response.status;
  const message = await response.json();
  console.log('Status:', status);
console.log('Message:', message);
  return {status, message};
}