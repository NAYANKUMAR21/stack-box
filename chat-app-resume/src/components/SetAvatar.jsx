import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import ImageUploadComponent from "./ImageUpload";
export const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
export default function SetAvatar() {
  const api = `https://api.dicebear.com/8.x/bottts/svg?seed=RobotName`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          import.meta.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const getAvatar = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
        console.log(data);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    getAvatar();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-12 bg-white h-screen w-screen">
          <img
            src="https://i.pinimg.com/originals/07/24/88/0724884440e8ddd0896ff557b75a222a.gif"
            alt="loader"
            className="max-w-full"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-12 bg-white h-screen w-screen p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex gap-8 flex-wrap justify-center">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`border-4 ${
                  selectedAvatar === index
                    ? "border-blue-600"
                    : "border-transparent"
                } p-2 rounded-full flex justify-center items-center transition duration-500 ease-in-out cursor-pointer`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-24 transition duration-500 ease-in-out"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-[700px]">
            <div>
              <button
                onClick={setProfilePicture}
                className="bg-black hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md uppercase tracking-wide transition"
              >
                Set Image as Profile Picture
              </button>
            </div>
            <div>
              {/* <hr className="w-[600px] border-t border-amber-500" /> */}
              <Link to="/upload-image">
                <button className="bg-black hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md uppercase tracking-wide transition">
                  Upload A custom picture
                </button>
              </Link>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
