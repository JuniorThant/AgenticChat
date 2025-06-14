interface MessageBubbleProps {
  text: string;
  isUser: boolean;
}

export default function MessageBubble({ text, isUser }: MessageBubbleProps) {
  return (
    <div
      className={`max-w-[75%] px-4 py-2 rounded-lg my-1 text-sm ${
        isUser
          ? 'bg-blue-500 text-white self-end'
          : 'bg-gray-200 text-gray-900 self-start'
      }`}
    >
      {text}
    </div>
  );
}
