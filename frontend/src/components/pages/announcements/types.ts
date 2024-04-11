interface MessageType {
    author: string;
    message: string;
    createdAt: string;
}

export interface GroupMessagesType {
    recipients: number[];
    messages: MessageType[];
}