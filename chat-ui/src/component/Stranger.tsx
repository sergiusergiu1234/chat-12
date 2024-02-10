import { useState } from "react";


import { person } from "../types/person.types";
import Friend from "./Friend";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";

interface StrangerProps {
  strangerData: person;
}
const Stranger: React.FC<StrangerProps> = ({ strangerData }) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<person>(strangerData);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
  const handleSendFriendRequest = async () => {
    if (loading) return;
    setLoading(true);

    try{
     const response =    axiosPrivate.post(`/sendFriendRequest/${strangerData.id}`,{},{
            headers:{
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        const data =(await response).data as person;
         setInfo((prevState) => ({
          ...prevState,
          request: data.request
        }));
    }catch(error){
        console.log(error)
    }


  };

  const handleCancelFriendRequest = () => {
    try{
        const response = axiosPrivate.delete(`/cancelFriendRequest/${strangerData.id}`,{
            headers:{
                'Authorization': `Bearer ${auth.accessToken}`
              }
        });
        setInfo((prevState) => ({
                  ...prevState,
                  request: null,
                }));
    }catch(error){
        console.log(error);
    }



  };

  return (
    <div className="bg-gray-500 rounded-xl mt-3">
        
      {strangerData.id === auth.userId ? null : (
        <div>
          <Friend friendData={strangerData} />
          {info.request === null ? (
            info.friends === true ? (
              <></>
            ) : (
              <button className="bg-green-500 p-1 rounded-md hover:green-700 hover:cursor-pointer"
                onClick={handleSendFriendRequest}>
                Send friend request
              </button>
            )
          ) : (
            <>
              {info.request.receiver == auth.userId ? (
                <button onClick={handleSendFriendRequest}>
                  Accept friend request
                </button>
              ) : (
                <button className="" onClick={handleCancelFriendRequest}>
                  Cancel friend request
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Stranger;
