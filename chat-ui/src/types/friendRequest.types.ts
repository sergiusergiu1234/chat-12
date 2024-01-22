import { person } from "./person.types"

export type friendRequest = {
    requestId:string;
    senderId: string; 
    receiverId: string;
}