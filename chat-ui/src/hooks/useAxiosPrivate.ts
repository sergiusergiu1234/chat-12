import  { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate, useLocation } from "react-router-dom";
//intercept api requests. If a request fails and gets unauthorized error, we refresh the token and retry once
const useAxiosPrivate = () =>{
    const refresh = useRefreshToken();
    const {auth} = useAuth();


    useEffect(()=>{

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config =>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(

            //if all good we return response
            response => response,

            //if it fails we go in here
            async (error) =>{
                const prevRequest = error?.config;
                //401 sau 403 idk yet
                if(error?.response?.status === 401 && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error)
            }
        );

        return () =>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    },[auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;