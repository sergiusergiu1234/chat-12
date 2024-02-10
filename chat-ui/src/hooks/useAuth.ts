import { useContext } from "react"
import AuthenticationContext from "../context/authContext"

const useAuth = () =>{
    return useContext(AuthenticationContext);    
}

export default useAuth;