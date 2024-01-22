import { timeStamp } from "console";
import { conversation } from "../types/conversation.types";
import Button from "./Button";
import { person } from "../types/person.types";
import { useContext } from "react";
import AuthenticationContext from "../context/authContext";


interface ConversationProps {
    conversation:conversation,
    selectConversation: ()=> void
}
const Conversation:React.FC<ConversationProps> = ({conversation, selectConversation}) => {
    const {auth} = useContext(AuthenticationContext);
    return (  <Button onClick={selectConversation}>
        {conversation.isGroupChat ? (
            <label>{conversation.name}</label>
        ) : (
            conversation.participants
                .filter(person => person.id !== auth.userId)
                .map(person => (
                    <label key={person.id}>{person.username}</label>
                ))
        )}
    </Button>)
}
export default Conversation;