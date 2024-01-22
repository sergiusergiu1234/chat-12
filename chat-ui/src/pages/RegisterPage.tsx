import { CharacterEncoding } from "crypto";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { ReportFileInError } from "typescript";
import { registerUser } from "../api/api";
import AuthenticationContext from "../context/authContext";


interface RegisterData {
    username :string;
    password: string;
}

const RegisterPage = () =>{
    const {auth} = useContext(AuthenticationContext);
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



    const handleSubmit =  (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(validForm){
            const registerData =  {
                username: username ,password: password
            }
            console.log(registerData)
            registerUser(registerData).then(data => {
                if(data.status === 200){
                    return <h1>OK</h1>
                }
            })
        }
       
    }

    return (<div>
            <h4>Register</h4>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input value={username} onChange={changeUsername} placeholder="Enter username"></input>
                <label>Password</label>
                <input value={password} onChange={changePassword} placeholder="Enter password" type="password"></input>
                <label>Confirm password</label>
                <input value={confirmPassword} onChange={changeConfirmPassword} placeholder="Repeat password" type="password"></input>
                <button disabled={!validForm} type="submit">Register</button>
            </form>
            <a href="/login">Already registered</a>
    </div>)
}

export default RegisterPage;