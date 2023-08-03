"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import { useConversation } from "@/app/hooks/useConversation";
import { MessageBox } from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find, update } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export const Body: React.FC<BodyProps> = (props) => {
  const { initialMessages } = props || {};
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prev) => {
        if (find(prev, { id: message.id })) {
          return prev;
        }
        return [...prev, message];
      });
      bottomRef.current?.scrollIntoView();
    };

    /**
     * edit the sent message
     */
    const updateMessageHandler = (message: FullMessageType) => {
      setMessages((prev) =>
        prev.map((currentMessage) => {
          if (currentMessage.id === message.id) {
            return message;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messages:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};
