import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
}

interface ChatHistoryProps {
  chatHistory: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start py-2 px-4 rounded-lg ${
            message.type === "user"
              ? "bg-accent text-white"
              : "text-black-800"
          }`}
        >
          {message.type === "user" && (
            <span className="mr-2 font-bold text-black-800">You:</span>
          )}

          <div>
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>
      ))}
    </>
  );
};

export type { ChatMessage };
export default ChatHistory;