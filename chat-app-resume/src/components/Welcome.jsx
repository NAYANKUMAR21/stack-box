import React, { useState, useEffect } from "react";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const setUserFn = async () => {
      const data = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
      );
      console.log(data);
      setUserName(data.username);
    };
    setUserFn();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center m-auto text-black">
      <img
        src="https://media.tenor.com/CigpzapemsoAAAAi/hi-robot.gif"
        alt="robo"
        className="h-80"
      />
      <h1 className="text-center text-2xl font-semibold">
        Welcome <span className="text-blue-600">{userName}!</span>
      </h1>
      <h3 className="text-lg mt-2">to STACK BOX</h3>
    </div>
  );
}
