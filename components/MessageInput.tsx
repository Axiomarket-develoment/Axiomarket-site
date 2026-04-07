import React, { useRef } from "react";
import { FaUserCircle, FaPaperPlane, FaPaperclip } from "react-icons/fa";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: () => void;
  handleFileSend: (files: FileList) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleFileSend,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSend(files);
      e.target.value = "";
    }
  };

  return (
    <div className="p-3 bg-[#0C0C0C]  border-blue-200">

      
      <div className="w-full h-px bg-[#2A2A2C] mb-3" />
      <div className="flex items-center gap-2  shadow-sm  py-2  transition-all duration-150">
        {/* User Icon */}

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#050505] placeholder:text-[#B5B8B7] placeholder:text-sm text-[#B5B8B7] text-sm outline-none transition focus:ring-0 focus:ring-blue-300 focus:bg-[#050505]"
        />

        {/* File Upload */}
        {/* <label
          className="cursor-pointer text-blue-500 hover:text-blue-600 transition-transform duration-150 hover:scale-110"
          title="Attach file"
        >
          <FaPaperclip className="w-6 h-6" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </label> */}

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="  py-3 px-5 rounded-full  text-[#FF394A] bg-[#000000] text-xs flex items-center justify-center  transition-transform duration-150 hover:scale-105"
          title="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;