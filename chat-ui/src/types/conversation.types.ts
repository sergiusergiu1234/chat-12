import { message } from "./message.types";
import { person } from "./person.types";

export type conversation ={
    id: string,
    name:string | null,
    participants: person[],
    isGroupChat: boolean;
    messages:message[]
    //timestamp: string
}