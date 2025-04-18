import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const parseLocalStorage = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    parseLocalStorage();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <div className="grid grid-rows-[10%_75%_15%] overflow-hidden bg-blue-100">
          {/* Brand */}
          <div className="flex items-center justify-center gap-4 py-2">
            {/* src="https://png.pngtree.com/png-clipart/20200224/original/pngtree-data-base-concept-cartoon-style-png-image_5249227.jpg" */}
            <img src="/chat-logo.png" alt="logo" className="h-8 rounded-xl" />
            <h5 className="text-blue-600 uppercase text-lg font-semibold">
              STACK BOX
            </h5>
          </div>

          {/* Contacts List */}
          <div className="flex flex-col items-center gap-2 overflow-auto px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                onClick={() => changeCurrentChat(index, contact)}
                className={`flex items-center gap-4 w-11/12 cursor-pointer rounded-md p-2 transition-all duration-300 ${
                  index === currentSelected ? "bg-blue-600" : "bg-blue-400"
                }`}
              >
                <div className="flex-shrink-0">
                  <img src={`${contact.avatarImage}`} alt="" className="h-12" />
                </div>
                <div>
                  <h3 className="text-white text-lg">{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Current User */}
          <div className="bg-blue-600 flex justify-center items-center gap-6 py-3 px-2 md:gap-2">
            <div>
              <img
                src={`${currentUserImage}`}
                alt="avatar"
                className="h-16 max-w-full rounded-xl"
              />
            </div>
            <div>
              <h2 className="text-white text-xl md:text-base">
                {currentUserName}
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
