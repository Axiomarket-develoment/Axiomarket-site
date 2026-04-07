import React from "react";
import MessageBubble from "./MessageBubble";
import { DateSeparator } from "./DateSeperator";

type MessageType = {
    _id?: string;
    sender_name: string;
    sender_id?: string;
    message: string;
    timestamp?: number; // store timestamps as number (Date.now())
    sender_img?: string;
    msg_type?: string;
};

type MessagesListProps = {
    message: MessageType[]; // array of messages
    userId: string;

};


const MessagesList: React.FC<MessagesListProps> = ({
    message,
    userId,
   
}) => {

    // console.log(message)
    return (
        <>
            {message.map((msg, index) => {
                const prevMsg = message[index - 1];

                const showDateSeparator =
                    !prevMsg ||
                    (prevMsg.timestamp &&
                        msg.timestamp &&
                        new Date(prevMsg.timestamp).toDateString() !==
                        new Date(msg.timestamp).toDateString());

                return (
                    <React.Fragment key={msg._id ?? index}>
                        {showDateSeparator && msg.timestamp && (
                            <DateSeparator date={Number(msg.timestamp)} /> // ✅ convert to number
                        )}

                        <MessageBubble
                            message={msg}
                            userId={userId}
                        />

                        
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default MessagesList;
