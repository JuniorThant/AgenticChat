import type { MessageContainerProps } from "../helpers/types";

export default function MessageContainer({ messages }: MessageContainerProps) {
  return (
    //Message Container
    <div className="flex-1 flex flex-col justify-end overflow-y-auto ">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`m-3 p-3 rounded-lg max-w-[70%] ${
            msg.isUser
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-500 text-white self-start"
          } `}
        >
          {msg.imageUrl && (
            <img
              src={msg.imageUrl}
              alt="chat-image"
              className="w-40 h-40 rounded mb-2 object-cover"
            />
          )}
          {msg.text}
        </div>
      ))}
    </div>
  );
}
