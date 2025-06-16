export interface Message{
    text:string;
    isUser:boolean;
    imageUrl?:string;
}

export interface MessageContainerProps{
    messages:Message[]
}

export interface MessageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

