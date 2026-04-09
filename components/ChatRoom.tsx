"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { API_URL, apiRequest } from "../utils/apiRequest";
// import MessageHeader from "./MessageHeader";
import MessagesList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
    sender_name: string;
    sender_id?: string;
    message: string;
    timestamp: number;
    msg_type?: string;
}

interface Partner {
    fullName: string;
}

interface UserChatProps {
    conversationId: string;
}

const UserChat: React.FC<UserChatProps> = ({ conversationId }) => {

    console.log(conversationId)
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);


    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<any>(null);


    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const hasInitializedSocket = useRef(false);



    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch messages on mount
    useEffect(() => {
        const fetchMessages = async () => {

            const token = localStorage.getItem("auth-token") || localStorage.getItem("token");

            const res = await apiRequest("/user_chat/get_messages", {
                method: "POST",
                body: { token, conversationId },
                showLoading: false, // ✅ disables the "Please wait..." toast
            });
            if (res.success && Array.isArray(res.data?.data)) {
                const mappedMessages = res.data.data.map((m: any) => ({
                    sender_name: m.sender_name, // ✅ already correct from backend
                    sender_id: m.sender_id,
                    message: m.message,
                    timestamp: m.timestamp,
                    msg_type: m.msg_type || "text",
                }));

                setMessages(mappedMessages);
            } else {
                toast.error("Failed to load messages");
            }
        };

        fetchMessages();
    }, []);

    // Initialize socket
    useEffect(() => {
        if (hasInitializedSocket.current) return;
        hasInitializedSocket.current = true;

        const socket = io(API_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected:", socket.id);

            // ✅ JOIN ROOM HERE
            socket.emit("join-room", conversationId);
        });

        socket.on("receive-error-message", (msg) =>
            toast.error(msg)
        );

        socket.on("receive-message", (data) => {
            setMessages((prev) => [...prev, data.message]);
        });

        socket.on("user-typing", (data) => {
            setTypingUsers((prev) => {
                if (!prev.includes(data.sender_name)) {
                    return [...prev, data.sender_name];
                }
                return prev;
            });
        });

        socket.on("user-stop-typing", (data) => {
            setTypingUsers((prev) => prev.filter(name => name !== data.sender_name));
        });

        return () => {
            socket.disconnect();
            hasInitializedSocket.current = false;
        };
    }, [conversationId]);


    const handleTyping = (value: string) => {
        setNewMessage(value);

        if (!socketRef.current) return;

        // Emit typing immediately
        if (!isTyping) {
            setIsTyping(true);
            socketRef.current.emit("typing", {
                conversation_id: conversationId,
                sender_name: user.username,
            });
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Only set stop-typing if input is empty
        if (value.trim() === "") {
            setIsTyping(false);
            socketRef.current.emit("stop-typing", {
                conversation_id: conversationId,
                sender_name: user.username,
            });
        } else {
            // Reset timeout if user stops typing for 1.5s
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                socketRef.current?.emit("stop-typing", {
                    conversation_id: conversationId,
                    sender_name: user.username,
                });
            }, 1500);
        }
    };

    // Send a text message
    const handleSend = () => {
        if (!newMessage.trim() || sending || !socketRef.current) return;

        setSending(true);

        const token = localStorage.getItem("auth-token") || localStorage.getItem("token");

        socketRef.current.emit(
            "group-message",
            {
                token,
                conversation_id: conversationId,
                message: newMessage,
                msg_type: "text"
            },
            (res: any) => {
                setSending(false);

                if (res?.status !== "ok") {
                    toast.error(res?.msg || "Failed to send message");
                }
            }
        );

        // stop typing immediately
        setIsTyping(false);
        socketRef.current.emit("stop-typing", { conversation_id: conversationId, sender_name: user.username });

        setNewMessage("");
        setSending(false);
    };
    // Send files (basic placeholder)
    const handleFileSend = (files: FileList) => {
        if (!files.length) return;

        const fileMessage: Message = {
            sender_name: user.fullname || "You",
            sender_id: user._id,
            message: `${files.length} file${files.length > 1 ? "s" : ""} sent`,
            timestamp: Date.now(),
            msg_type: "file",
        };

        setMessages((prev) => [...prev, fileMessage]);
    };

    const pageVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" as const },
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3, ease: "easeIn" as const },
        },
    };

    return (
        <motion.div
            className="flex flex-col rounded-xl min-h-[60vh] max-h-[68vh]  bg-[#0C0C0C]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
        >
            {/* <MessageHeader
        partner={{
          fullName: partner?.fullName || "Market Chat",
        }}
      /> */}

            <div className="flex-1 rounded-xl overflow-y-auto p-4 bg-[#0C0C0C]">
                <MessagesList
                    message={messages}
                    userId={user._id}
                />
                <div ref={chatEndRef} />
            </div>

            {typingUsers.length > 0 && (
                <p className="text-xs text-gray-400 italic px-4 pb-1">
                    {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
                </p>
            )}
            <div className="bg-[#0C0C0C]  ">
                <MessageInput
                    newMessage={newMessage}
                    setNewMessage={handleTyping}
                    handleSendMessage={handleSend}
                    handleFileSend={handleFileSend}
                />
            </div>
        </motion.div>
    );
};

export default UserChat;