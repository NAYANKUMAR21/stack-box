import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <svg
      className="w-6 h-6 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 1 1 16 0 8 8 0 1 1-16 0"
      ></path>
    </svg>
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // For loading spinner
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Both fields are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true); // Start loading
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { username, password });

      setLoading(false); // Stop loading
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        localStorage.setItem(
          import.meta.env.VITE_REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-gradient-to-r ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-dark-800 rounded-3xl p-12 shadow-lg w-[90%] max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              className="h-16 rounded-xl"
              src={
                "https://png.pngtree.com/png-clipart/20200224/original/pngtree-data-base-concept-cartoon-style-png-image_5249227.jpg"
              }
              alt="logo"
            />
            <h2 className="text-black font-bold text-3xl tracking-wide">
              STACK BOX
            </h2>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            min="3"
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <button
            type="submit"
            className="bg-[#0078ff] text-white font-semibold py-3 rounded-lg uppercase tracking-wider hover:bg-blue-600 transition"
          >
            {loading ? <LoadingSpinner /> : "Log In"}
          </button>
          <span className="text-black uppercase text-sm text-center">
            New to Chat?{" "}
            <Link
              to="/register"
              className="text-[#0078ff] font-semibold hover:underline"
            >
              Create Account.
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
