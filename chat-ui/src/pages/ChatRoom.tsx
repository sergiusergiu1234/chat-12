import ConversationsList from "../component/ConversationsList";
import Navbar from "../component/Navbar";
import ConversationRoom from "../component/ConversationRoom";
import { useWebSocket } from "../context/WebSocketContext";
import { conversation } from "../types/conversation.types";

const ChatRoom = () => {
  
  const { activeConversation, conversations } = useWebSocket();

  return (
    <div className="h-screen w-screen">
      
      <div className=" flex flex-row ">
        <div className={`flex flex-col w-1/4 min-w-80 h-screen sticky ${activeConversation ? 'maxsm:hidden': 'maxsm:w-full'}`}>
          <Navbar />
          {/* Conversation List */}
          <div className={`h-full bg-gray-600 flex flex-col overflow-y-auto custom-scrollbar  ${activeConversation ? 'maxsm:hidden' : 'maxsm:w-full'} `}>
            <ConversationsList />
          </div>
        </div>
        

        {/* Conversation Room */}
        <div className={`bg-chatroom-pattern   h-screen bg-cover flex flex-col justify-center items-center w-3/4 maxsm:w-full ${activeConversation ? 'maxsm:w-screen' : 'maxsm:hidden'} `}>
          <ConversationRoom conversation={conversations?.find((conv:conversation)=>{
           return conv.id === activeConversation
          })} />
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;