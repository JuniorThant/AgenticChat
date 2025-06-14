import React from 'react'

interface Message{
    text:string;
    isUser:boolean;
}

interface MessageContainerProps{
    messages:Message[]
}

export default function MessageContainer({messages}:MessageContainerProps) {
  return (
    <div className="flex-1 flex flex-col justify-end overflow-y-auto ">
        {messages.map((msg,idx)=>(
            <div key={idx} className={`m-3 p-3 rounded-lg max-w-[70%] ${msg.isUser 
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-500 text-white self-start'
            } `}>
                {msg.text}
            </div>
        ))}
    </div>
  )
}
