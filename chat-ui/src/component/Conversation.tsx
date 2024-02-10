import { timeStamp } from "console";
import { conversation } from "../types/conversation.types";
import { person } from "../types/person.types";
import { useContext } from "react";
import useAuth from "../hooks/useAuth";
// import AuthenticationContext from "../context/authContext";


interface ConversationProps {
    conversation:conversation,
    selectConversation: ()=> void
}
const Conversation:React.FC<ConversationProps> = ({conversation, selectConversation}) => {
    const {auth} = useAuth();
    return ( 
        
        <button className="p-1  hover:bg-gray-700 hover:pointer duration-300 text-gray-200 rounded-3xl ml-5 mr-5"
         onClick={selectConversation}>
        {conversation.isGroupChat ? (
            <div  className="flex flex-row items-center">
                <img  className=" rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2" src="./group.png"/>
                <label className="cursor-pointer">{conversation.name}</label>
            </div>
            
        ) : (
            conversation.participants
                .filter(person => person.id !== auth.userId)
                .map(person => (
                    <div className="flex flex-row items-center">
                        <img  className="rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2" src="./person.png"/>
                        <label className="cursor-pointer"  key={person.id}>{person.username}</label>
                    </div>
                ))
        )}
    </button>)
}
export default Conversation;