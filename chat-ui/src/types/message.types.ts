export type message ={
    id?:string
    senderId: string,
    senderName: string,
    content:string,
    timestamp: string,
    seenBy?: string[]
}