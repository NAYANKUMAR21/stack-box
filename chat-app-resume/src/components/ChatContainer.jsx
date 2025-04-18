import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const newMessages = [...messages, { fromSelf: true, message: msg }];
    setMessages(newMessages);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid grid-rows-[10%_80%_10%] gap-1 overflow-hidden md:grid-rows-[15%_70%_15%] h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12">
            <img
              src={`${currentChat.avatarImage}`}
              alt="avatar"
              className="h-12 w-12 rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {currentChat.username}
          </h3>
        </div>
        <Logout />
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-4 overflow-y-auto px-8 py-4 custom-scrollbar">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()} className="flex">
            <div
              className={`flex items-center ${
                message.fromSelf ? "justify-end w-full" : "justify-start w-full"
              }`}
            >
              <div
                className={`max-w-[40%] md:max-w-[70%] break-words p-4 text-base rounded-[2rem] ${
                  message.fromSelf
                    ? "bg-blue-200 text-black rounded-br-none"
                    : "bg-blue-300 text-black rounded-bl-none"
                }`}
              >
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
