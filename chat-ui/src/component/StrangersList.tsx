import { useContext, useEffect, useState } from "react";
import { person } from "../types/person.types";
// import { fetchEveryone } from "../api/api";
import Stranger from "./Stranger";
import AuthenticationContext from "../context/authContext";

const StrangersList = () => {
    const [strangers,setStrangers] = useState<person[]>();
    const  {auth} = useContext(AuthenticationContext);
    
    useEffect(()=>{
        // fetchEveryone(auth.accessToken).then(data=>{
        //     setStrangers(data);
        // })
    },[])

    return(<div>
        <h4>Recommended people</h4>
        {strangers?.map(stranger => 
            <Stranger key={stranger.id} strangerData={stranger}/>
        )}
    </div>)
}

export default StrangersList;