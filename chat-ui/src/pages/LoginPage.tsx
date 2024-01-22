import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext, { AuthenticationContextProvider } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();
    const {auth,setAuth} = useContext(AuthenticationContext);

    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          console.log('submitted');
          const data = await loginResponse();
          console.log(data.userId)
          setAuth({username:  data.username, accessToken: data.token, refreshToken:"", userId: data.userId});
          localStorage.setItem("access",data.token);
          localStorage.setItem("username",data.username);
          localStorage.setItem("userId", data.userId);
          navigate("/app");
        } catch (error) {
          console.error('Error:', error);
        }
      };

  const loginResponse = async () => {
    const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };


  const handleUsernameChange =(e:React.ChangeEvent<HTMLInputElement>) =>{
    setUsername(e.currentTarget.value)
  }

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.currentTarget.value)
  }
  return (
    
                <div>
        {auth.accessToken !== '' && <label>helo </label>}
      <h1>Login page</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={username} onChange={handleUsernameChange}/>
        <label>Password</label>
        <input type="password" value={password} onChange={handlePasswordChange}/>
        <button type="submit" >Submit</button>
        <a href='/register'>Register</a>
      </form>
    </div>

  );
};

export default LoginPage;
