import { useState } from "react";
import InputContainer from "./InputContainer";
import MessageContainer from "./MessageContainer";
import type { Message } from "../helpers/types";

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="flex h-screen">
      {/* Logo Div */}
      <div className="w-1/4 h-screen text-4xl items-center justify-center flex bg-gray-100">
        Agentic Chat App
      </div>
      {/* Separator */}
      <div className="w-px bg-gray-300 h-full" />
      {/* Chat Div */}
      <div className="w-3/4 h-screen flex flex-col">
        {/* Message Container */}
        <MessageContainer messages={messages} />
        {/* Input Container */}
        <InputContainer messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}
