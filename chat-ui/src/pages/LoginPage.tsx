import React, {useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"
  const { setAuth } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.clear();
    try {
      const response = await axios.post(
        "/api/v1/auth/authenticate",
        JSON.stringify({ username, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;

      setAuth({username:  response.data.username || '', userId: response.data.userId || '', accessToken:accessToken, refreshToken:refreshToken})
      navigate(from, {replace:true });
    } catch (error) {
      console.error("Error when login:", error);
    }
  };

 

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };
  return (
    <div className=" flex flex-col justify-center  bg-gray-200 h-screen w-screen">
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <div className="flex items-center justify-center flex-col mt-5">
          <label className="text-xl">Username</label>
          <input
            className=" rounded-xl border-solid border-2 p-2 w-2/6 maxsm:w-5/6 mb-5"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div className="flex items-center justify-center flex-col mt-5">
          <label className="text-xl">Password</label>
          <input
            className=" rounded-xl border-solid border-2 p-2 w-2/6 maxsm:w-5/6 mb-5"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <button
          type="submit"
          className="text-2xl bg-green-900 w-1/6 maxsm:w-32 rounded-md border-2 border-solid border-black self-center hover:bg-green-700"
        >
          Submit
        </button>
        <a
          href="/register"
          className="text-blue-500 underline hover:text-blue-900 w-1/6 maxsm:w-32 self-center"
        >
          Register
        </a>
      </form>
    </div>
  );
};

export default LoginPage;
