import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="grid grid-cols-[5%_95%] items-center px-8 md:px-4 gap-4 w-full">
      {/* Emoji Button */}
      <div className="relative flex items-center text-white gap-4">
        <BsEmojiSmileFill
          className="text-yellow-300 text-2xl cursor-pointer"
          onClick={handleEmojiPickerhideShow}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-16 z-10">
            <Picker onEmojiClick={(emoji) => handleEmojiClick(emoji)} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        className="flex items-center gap-4 bg-white/20 rounded-3xl w-full py-2 px-4"
        onSubmit={(e) => sendChat(e)}
      >
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="flex-1 bg-transparent text-black border-none outline-none text-lg placeholder:text-black/70"
        />
        <button
          type="submit"
          className="bg-blue-600 p-2 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
        >
          <IoMdSend className="text-white text-2xl" />
        </button>
      </form>
    </div>
  );
}
