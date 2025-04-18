import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { registerRoute } from "../utils/APIRoutes";
import axios from "axios";
import { LoadingSpinner } from "./Login";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

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
    const { username, email, password, confirmPassword } = values;
    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    console.log(registerRoute);
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const { username, email, password } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        setLoading(false);
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === true) {
          localStorage.setItem(
            import.meta.env.VITE_REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        toast.error("Registration failed. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-6 bg-gradient-to-r">
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
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-dark-700 text-black"
          />
          <button
            type="submit"
            className="bg-[#0078ff] text-white font-semibold py-3 rounded-lg uppercase tracking-wider hover:bg-blue-600 transition"
          >
            {loading ? <LoadingSpinner /> : "Register"}
          </button>
          <span className=" uppercase text-sm text-center">
            <span className="text-black">Already have an account? </span>
            <Link
              to="/login"
              className="text-[#0078ff] font-semibold hover:underline"
            >
              Log In
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
