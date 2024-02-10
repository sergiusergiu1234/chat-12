
import { useContext, useEffect, useState } from "react";

import AuthenticationContext from "../context/authContext";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";


interface RegisterData {
    username :string;
    password: string;
}

const RegisterPage = () =>{
    const navigate = useNavigate();
    const usernameRegex = /^\w{6,18}$/;
    const [username, setUsername] = useState<string>('');
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState<string>('');
    const [validPassword, setValidPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [validConfirmPassword, setValidConfirmPassword] = useState<boolean>();
    const [validForm, setValidForm] = useState<boolean>(false);

  
    const changePassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.currentTarget.value);
    }

    const changeUsername = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.currentTarget.value);
    }
    useEffect(()=>{
       console.log(usernameRegex.test(username)); 
    },[username])

    const changeConfirmPassword = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setConfirmPassword(e.currentTarget.value)
    }

    useEffect(()=>{
        const valid = usernameRegex.test(username);
        setValidUsername(valid);
    },[username])

    useEffect(()=>{
       const valid =  usernameRegex.test(password);
       setValidPassword(valid);
    },[password])

    useEffect(()=>{
        const valid = (password === confirmPassword && confirmPassword !== '');
        setValidConfirmPassword(valid);
    },[confirmPassword])

    useEffect(()=>{
        if(validUsername && validPassword && validConfirmPassword){
            setValidForm(true);
        }else{
            setValidForm(false);
        }
    },[validUsername, validPassword, validConfirmPassword])



    const handleSubmit =  async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(validForm){
            const registerData =  {
                username: username ,password: password
            }
            try{
                const response = await axios.post('/api/v1/auth/register',
                    JSON.stringify(registerData),{
                        headers: {'Content-Type': 'application/json'},
                    }
                );
                console.log(response.data);
              if(response.status === 200){
                navigate('/login');
              }
            }catch(error){
                console.log(error)
            }
        }
       
    }
    return (
        <div className="flex flex-col  justify-center bg-gray-200 h-screen w-screen">
      
          <form onSubmit={handleSubmit} className="flex flex-col items-center ">
            
            <div className="flex flex-row items-center maxsm:flex-col">
              <label className="text-lg w-24">Username</label>
              <input className=" m-2 rounded-xl border-solid border-2 p-2 w-5/6 " value={username} onChange={changeUsername} placeholder="Enter username" />

            </div>
      
            <div className="flex flex-row items-center maxsm:flex-col">
              <label className="text-lg w-24">Password</label>
              <input className=" m-2 rounded-xl border-solid border-2 p-2 w-5/6 " value={password} onChange={changePassword} placeholder="Enter password" type="password" />
            </div>
      
            <div className="flex flex-row items-center maxsm:flex-col mb-10">
              <label className="text-lg w-24">Confirm password</label>
              <input className=" m-2 rounded-xl border-solid border-2 p-2 w-5/6 " value={confirmPassword} onChange={changeConfirmPassword} placeholder="Repeat password" type="password" />
            </div>
      
            <button disabled={!validForm} type="submit" className="text-2xl bg-green-900 w-1/6 maxsm:w-32 rounded-md border-2 border-solid border-black self-center hover:bg-green-700">Register</button>
            <a href="/login" className="text-blue-500 underline hover:text-blue-900 w-1/6 self-center">Already registered</a>
          </form>
        </div>
      );
      
}

export default RegisterPage;