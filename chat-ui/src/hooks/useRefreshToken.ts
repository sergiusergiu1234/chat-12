import axios from "axios";
import useAuth from "./useAuth";


const useRefreshToken = () =>{
const {auth, setAuth} = useAuth();

const refresh = async () =>{
    const response = await axios.post("/api/v1/auth/refresh-token",{},{
        headers: {
            'Authorization': `Bearer ${auth.refreshToken}`
        }
    });
    setAuth(prev => {
        console.log('prevToken',JSON.stringify(prev));
        console.log('resp from refresh',response.data)
        return {...prev, accessToken:response.data.accessToken}
    })
    return response.data.accessToken;
} 

    return refresh;
}

export default useRefreshToken;