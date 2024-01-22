import { friendRequest } from "./friendRequest.types"

export type person = {
    id: string,
    username: string,
    request: friendRequest | null;
    friends:boolean
}