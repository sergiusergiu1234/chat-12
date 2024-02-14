import axios from "axios";
import useAuth from "./useAuth";
import { useState } from "react";


const useRefreshToken = () =>{
const {auth, setAuth} = useAuth();
const [retried,setRetried] = useState<boolean>(false);
const refresh = async () =>{
    console.log("Refreshing token")
    try{
        const response = await axios.post("/api/v1/auth/refresh-token",{},{
            headers: {
                'Authorization': `Bearer ${auth.refreshToken}`
            }
        });
        console.log(await response.status)

        setAuth(prev => {
            console.log('prevToken',JSON.stringify(prev));
            console.log('resp from refresh',response.data)
            return {...prev, accessToken:response.data.accessToken}
        })
        return response.data.accessToken;
    }catch(error){
        console.log("From refresh fc", error);
        if(retried == false){
            setRetried(true);
            console.log(retried)
        }else{
            localStorage.clear();
         setAuth({userId:'',username:'', accessToken:'', refreshToken:''})
        }
         
    }
    
} 

    return refresh;
}

export default useRefreshToken;