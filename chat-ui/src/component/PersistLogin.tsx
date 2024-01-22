import { Children, useContext, useEffect, useState } from "react";
import AuthenticationContext from "../context/authContext";
import { Outlet, useNavigate } from "react-router-dom";

const PersistLogin = () => {
       const navigate = useNavigate();
       const { auth, setAuth } = useContext(AuthenticationContext);
       const [isLoading, setIsLoading] = useState(true);
       useEffect(() => {
              const access = window.localStorage.getItem("access");
              const username = window.localStorage.getItem("username");
              const userId = window.localStorage.getItem("userId");
              if (access != null) {
                     setAuth({
                            username: username ? username : "", accessToken: access, refreshToken: "", userId: userId ? userId : ""
                     });
              }
              setIsLoading(false);
       }, [])

       useEffect(() => {
              if (!isLoading) {
                     if (auth.accessToken !== '') {
                     } else {
                            navigate('/login');
                     }
              }
       }, [auth.accessToken, isLoading, navigate]);
       return (<>
              {auth.accessToken !== '' && <Outlet />}
       </>
       )
}
export default PersistLogin;