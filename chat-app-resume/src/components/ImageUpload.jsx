import { useState } from "react";
import { setAvatarRoute } from "../utils/APIRoutes";

import { toast, ToastContainer } from "react-toastify";
import { toastOptions } from "./SetAvatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ImageUploadComponent() {
  const [image, setImage] = useState(null);
  const [imageReader, setImageReader] = useState(null);
  const [err, setError] = useState("");
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageReader(URL.createObjectURL(file));
      setImage(file);

      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   const base64String = reader.result.split(",")[1];
      //   setImage(base64String);
      //   console.log("Base64:", base64String);
      // };
      // reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    // navigate("/")
    // return
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ezuredui");
    if (!image) {
      toast.warning("Please upload a image", toastOptions);
      return;
    }
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dc3akfh6t/image/upload",
        formData
      );

      const user = await JSON.parse(
        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
      );
      console.log(user);

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: res.data.secure_url,
      });
      console.log(data);
      // setError("");
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          import.meta.env.VITE_REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
        return;
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
        return;
      }
    } catch (er) {
      console.log(er);
      setError(er.message);
      console.error(er);
    }
  };

  console.log(imageReader);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          Upload Your Image
        </h2>

        <label
          htmlFor="imageUpload"
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all rounded-xl p-6 text-center"
        >
          {imageReader ? (
            <img
              src={imageReader}
              alt="Preview"
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 01.88-2.65l6.42-7.6a1.5 1.5 0 012.4 0l6.42 7.6A4 4 0 0121 15v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z"
                />
              </svg>
              <p className="mt-2 text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400">
                PNG, JPG, or JPEG (max 5MB)
              </p>
            </div>
          )}
        </label>

        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      <button
        onClick={uploadImage}
        className="bg-black hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-md uppercase tracking-wide transition mt-5 cursor-pointer"
      >
        Upload Image
      </button>
      <ToastContainer />
    </div>
  );
}
