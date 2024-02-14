import { timeStamp } from "console";
import { conversation } from "../types/conversation.types";
import { person } from "../types/person.types";
import { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useWebSocket } from "../context/WebSocketContext";
// import AuthenticationContext from "../context/authContext";

interface ConversationProps {
  conversation: conversation;
  selectConversation: () => void;
}
const Conversation: React.FC<ConversationProps> = ({  conversation, selectConversation }) => {
  const { auth } = useAuth();
  const {messageHistory} = useWebSocket();
  const [unseenCounter, setUnseenCounter] = useState<number>(0);

  useEffect(() => {

    let unseenMessageCount = 0;
    if (messageHistory[conversation.id]) {
      messageHistory[conversation.id].forEach((msg) => {
        if (!msg.seenBy?.includes(auth.userId)  && msg.senderId !== auth.userId) {
          unseenMessageCount ++;
        }
      });
    }
    setUnseenCounter(unseenMessageCount);
  }, [messageHistory]);

  return (
    <button
      key={conversation.id}
      className="p-1 bg-gray-700  hover:bg-gray-800 hover:pointer hover:border-sky-50 hover:border-2 border-2 text-gray-200 rounded-3xl ml-5 mr-5 mt-5"
      onClick={()=>{selectConversation(); setUnseenCounter(0)}}
    >
      {conversation.isGroupChat ? (
        <div className="flex flex-row items-center">
          <img
            className=" rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2"
            src="./group.png"
          />
          <label className="cursor-pointer">{conversation.name}</label>
        </div>
      ) : (
        conversation.participants
          .filter((person) => person.id !== auth.userId)
          .map((person) => (
            <div key={conversation.id} className="flex flex-row items-center">
              <img
                className="rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2"
                src="./person.png"
              />
              <label className="cursor-pointer" key={person.id}>
                {person.username}
              </label>
            </div>
          ))
      )}
      {conversation.messages.length !== 0 &&  <div className="flex flex-row items-end justify-end pr-10 group group-hover:cursor-pointer">

      {(unseenCounter !== 0) && 
      <div className="mr-5 hover:cursor-pointer bg-red-700 rounded-3xl w-5 h-5 flex items-center justify-center">
          <label>{unseenCounter}</label>
        </div>}
       

        {conversation.messages[conversation.messages.length - 1].senderName ===
        auth.username ? (
          <label className="group-hover:cursor-pointer">You : </label>
        ) : (
          <label className="group-hover:cursor-pointer">
             {messageHistory[conversation.id][messageHistory[conversation.id].length-1].senderName}{" "}
            :{" "}
          </label>
        )}

        <label className="group-hover:cursor-pointer">
        {messageHistory[conversation.id][messageHistory[conversation.id].length-1].content} at{" "}
        </label>
        <label  className="group-hover:cursor-pointer">
          {messageHistory[conversation.id][messageHistory[conversation.id].length-1].timestamp}
        </label>
      </div>}
     
     
    
    </button>
  );
};
export default Conversation;
