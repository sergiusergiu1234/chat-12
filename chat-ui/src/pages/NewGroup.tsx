import { useContext, useEffect, useState } from "react";

import AuthenticationContext from "../context/authContext";
import { person } from "../types/person.types";

import { plainPerson } from "../types/plainPerson.types";
import { useNavigate } from "react-router-dom";
import BackButton from "../component/BackButton";
import useAuth from "../hooks/useAuth";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const NewGroup = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [friends, setFriends] = useState<person[]>([]);
  const [checkedFriends, setCheckedFriends] = useState<plainPerson[]>([
    { id: auth.userId, username: auth.username },
  ]);
  const [groupName, setGroupName] = useState<string>("");
  const navigate = useNavigate();
  const [message, setMessage ] = useState('');

  //get friends 
  useEffect(() => {

    const getFriends = async () =>{
      try{
        const response = axiosPrivate.get("/getFriends", {
          headers:{
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
       
        setFriends( (await response).data)
       }catch(error){
        console.log(error);
       }
    }

    getFriends();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        "/createConversation",
        JSON.stringify({
          participants: checkedFriends,
          isGroupChat: checkedFriends.length > 2,
          name: groupName,
        }),
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json', // Specify Content-Type header
          },
        }
      );
      setMessage("Conversation created.")
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (friend: plainPerson) => {
    setCheckedFriends((prevChecked) => {
      if (prevChecked.includes(friend)) {
        return prevChecked.filter((fr) => fr.id !== friend.id);
      } else {
        return [...prevChecked, friend];
      }
    });
  };

  const handleNameChange = (e: any) => {
    setGroupName(e.currentTarget.value);
  };

  const goBack = () => {
    navigate("/app");
  };

  return (
    <div className="flex flex-col bg-gray-400 items-center h-screen ">
      <BackButton mobileOnly={false} onCLick={() => goBack()} />

      {message ? <div className="bg-gray-700 w-2/6 h-2/6 flex items-center p-3 rounded-xl">
        <h1 className="text-green-400 text-xl">Conversation created.</h1>
      </div> :  <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend.id}>
                <td>
                  <div
                    className="flex items-center hover:bg-gray-700 p-2 hover:cursor-pointer "
                    onClick={() => handleCheckboxChange(friend)}
                  >
                    <div className="cursor-pointer flex flex-row items-center w-48 ">
                      {" "}
                      <img
                        className="rounded-3xl w-10 h-10 border-solid bg-white object-cover m-2"
                        alt={`profilePhoto of ${friend.username}`}
                      ></img>
                      <label className="text-lg w-24 hover:cursor-pointer">
                        {friend.username}
                      </label>
                    </div>

                    <div className="w-22">
                      <input
                        className="w-6 h-6"
                        type="checkbox"
                        checked={checkedFriends.includes(friend)}
                        onChange={() => handleCheckboxChange(friend)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <input
          type="text"
          onChange={handleNameChange}
          value={groupName}
          placeholder=" Group name"
          className="m-4 p-1"
        ></input>
        <button
          disabled={
            checkedFriends.length === 1 ||
            checkedFriends.length === 2 ||
            groupName.trim() === ""
          }
          type="submit"
          className={`bg-green-900 p-2 hover:bg-green-700 disabled:bg-gray-900`}
        >
          Create group
        </button>
      </form>}
     
    </div>
  );
};

export default NewGroup;
