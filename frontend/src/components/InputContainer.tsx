import { useState } from "react";
import { FaArrowUp, FaCameraRetro, FaQuestion } from "react-icons/fa";
import type { MessageProps } from "../helpers/types";

export default function InputContainer({
  messages,
  setMessages,
}: MessageProps) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const newMessages = [...messages];
    if (input.trim()) newMessages.push({ text: input, isUser: true });
    if (file)
      newMessages.push({
        text: "",
        isUser: true,
        imageUrl: URL.createObjectURL(file),
      });
    setMessages(newMessages);
    setShowModal(false);

    const formData = new FormData();
    if (file) formData.append("file", file);
    const promptToSend = input.trim() || (file ? "Describe this image" : "");
    formData.append("prompt", promptToSend);

    setInput("");
    setFile(null);

    try {
      if (isThinking) {
        const response = await fetch("http://localhost:8000/chat/thinking", {
          method: "POST",
          body: formData,
        });

        const aiMessage = await response.text();
        setMessages((prev) => [...prev, { text: aiMessage, isUser: false }]);
        setIsThinking(false);
      } else {
        const response = await fetch("http://localhost:8000/chat/stream", {
          method: "POST",
          body: formData,
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let aiMessage = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            aiMessage += decoder.decode(value, { stream: true });
            setMessages((prev) => [
              ...newMessages,
              { text: aiMessage, isUser: false },
            ]);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="border-t px-4 py-3 flex items-center gap-2">
      {/* Text input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message or add an image..."
        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
        className="hidden"
        id="file-upload"
      />

      {/* Show Image Preview */}
      {file && (
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className="hover:text-blue-500"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Photo Upload */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-gray-200 px-3 py-2 rounded-md"
      >
        <FaCameraRetro />
      </label>

      {/* Thinking Icon */}
      <button
        onClick={() => setIsThinking((prev) => !prev)}
        className={`cursor-pointer bg-gray-200 px-3 py-2 rounded-md ${isThinking ? "text-blue-500" : ""}`}
      >
        <FaQuestion />
      </button>

      {/* Send Button */}
      <button
        className="bg-blue-500 text-white p-4 rounded-md"
        onClick={handleSend}
      >
        Send
      </button>

      {/* Thinking State Indicator */}
      {isThinking && (
        <div className="absolute bottom-20 right-6 bg-white border border-black shadow-md p-2 z-10">
          Thinking Mode is on
        </div>
      )}

      {/* Image Preview Modal */}
      {showModal && file && (
        <div className="absolute bottom-20 right-4 bg-white border shadow-md rounded-md p-2 z-10">
          <span className="font-medium text-sm m-7">Image Preview</span>
          <img
            src={URL.createObjectURL(file)}
            alt="image-preview"
            className="w-40 h-40 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
