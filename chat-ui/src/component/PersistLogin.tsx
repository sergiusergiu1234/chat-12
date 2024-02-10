import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";


const PersistLogin = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth,setAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const aT = localStorage.getItem('accessToken')
        const rT = localStorage.getItem('refreshToken')
        const uId = localStorage.getItem('userId')
        const u = localStorage.getItem('username')
        if(aT && rT && uId && u ){
            setAuth({accessToken:aT, refreshToken:rT ,userId:uId,username:u})
        }


        const verifyRefreshToken = async () =>{
            try{
                await refresh();
            }catch(error){
                console.error(error);
            }
            finally{
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    },[])

    useEffect(()=>{
        localStorage.setItem('accessToken',auth.accessToken);
        localStorage.setItem('refreshToken',auth.refreshToken);
        localStorage.setItem('userId',auth.userId);
        localStorage.setItem('username',auth.username);
    },[auth])

    useEffect(()=>{
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
        if (!isLoading) {
            if (auth.accessToken !== '') {
            } else {
                   navigate('/login');
            }
     }
    },[isLoading,auth,navigate])


    return(
        <>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet/>
            }
        </>
    )
}

export default PersistLogin;