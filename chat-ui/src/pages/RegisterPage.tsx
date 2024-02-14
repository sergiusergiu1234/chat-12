
import { useContext, useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
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
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [tips, setTips] = useState<boolean>();
    
    const changePassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.currentTarget.value);
    }

    const changeUsername = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.currentTarget.value);
        setErrorMessage('')
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

              if(response.status === 200){
                navigate('/login');
              }else{
                console.log(response)
              }
            }catch(error:any){
                
                setErrorMessage(error.response.data || 'Error')
            }
        }
       
    }
    return (
        <div className="flex flex-col  justify-center bg-gradient-to-r from-slate-200 to-slate-300 h-screen w-screen">
      
          <form onSubmit={handleSubmit} className="flex flex-col items-center h-max">
            
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
            {errorMessage && <label className="text-red-500">{errorMessage}</label>}
           
            <div className="flex flex-row w-max items-center justify-center">
                <button  disabled={!validForm} type="submit" className=" p-2 text-2xl bg-green-900  maxsm:w-32 rounded-md border-2 border-solid border-black self-center hover:bg-green-700">Register</button>
                <FaRegQuestionCircle className="ml-3" onMouseLeave={()=>{setTips(false)}}  onMouseEnter={()=>{setTips(true)}}/>
            </div>
            <a href="/login" className="text-blue-500 underline hover:text-blue-900 w-1/6 self-center">Already registered</a>
          </form>
          {tips ? <div  className={` h-20 `}>
             <ul>
                        <li>
                            <label>
                                Username and password must be 6 to 18 characters long.
                               
                            </label>
                        </li>
                        <li>
                            <label>
                                 Passwords must match.
                            </label>
                        </li>
                    </ul>
                    </div> : <div className="h-20"></div>
                }
        </div>
      );
      
}

export default RegisterPage;