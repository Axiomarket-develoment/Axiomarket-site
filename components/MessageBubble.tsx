import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface Message {
  sender_name: string;
  sender_id?: string;
  message: string;
  timestamp?: number;
  msg_type?: string;
}

interface MessageBubbleProps {
  message: Message;
  userId: string;

}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  userId,

}) => {
  const isMine = message.sender_id === userId;
  const isSystem = message.sender_name === "System";

  // 🧠 System message (service completed, etc.)
  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-full">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${isMine ? "justify-end" : "justify-start"
        }`}
    >
      {/* Partner Icon (left side) */}
      {/* {!isMine && <FaUserCircle className="w-8 h-8 text-blue-500" />} */}
      <div className="flex flex-col text-[xs]">
        <div className={`flex gap-2 items-center ${isMine ? "justify-end" : " justify-start"} `}>
          <h2 className="text-[#FFFFFF]/40">{message.sender_name}</h2>

          {message.timestamp && (
            <span
              className={`block mt-1 text-[12px] ${isMine ? "text-[#FFFFFF]/40" : "text-[#FFFFFF]/40"
                }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        {/* Message bubble */}
        <div
          className={`max-w-[100%] px-4 py-3 rounded-2xl text-sm shadow ${isMine
            ? "bg-[#050505] text-white rounded-br-sm"
            : "bg-[#050505] text-white rounded-bl-sm"
            }`}
        >
          <p className="whitespace-pre-wrap">{message.message}</p>

        </div>
      </div>

      {/* User Icon (right side) */}
      {/* {isMine && <FaUserCircle className="w-8 h-8 text-blue-500" />} */}
    </div>
  );
};

export default MessageBubble;