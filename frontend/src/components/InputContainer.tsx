import { useState } from "react";

interface Message{
  text:string;
  isUser:boolean;
}

interface MessageProps{
  messages:Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function InputContainer({messages,setMessages}:MessageProps) {
  const [input,setInput]=useState("")

  const handleSend=async()=>{
    if(!input.trim()) return;

    const newMessages=[...messages,{text:input,isUser:true}]
    setMessages(newMessages)
    setInput("")

    try{
      const response=await fetch("http://localhost:8000/chat/message",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({message:input})
      })

      const reader=response.body?.getReader();
      const decoder=new TextDecoder("utf-8")
      let aiMessage=""

      if(reader){
        while(true){
          const{done,value}=await reader.read()
          if (done) break
          aiMessage+=decoder.decode(value,{stream:true})
          setMessages((prev)=>[...newMessages,{text:aiMessage,isUser:false}])
        }
      }
    }catch(error){
      console.error(error)
    }
  }

  return (
    <div className="border-t px-4 py-3 flex items-center gap-2">
        <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{
          if (e.key==="Enter" && !e.shiftKey){e.preventDefault(); handleSend();}
        }} placeholder="Type a message...." className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button className="bg-blue-500 text-white p-4 rounded-md" onClick={handleSend}>
            Send
        </button>
    </div>
  )
}
