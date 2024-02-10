import { AiOutlinePlusCircle } from "react-icons/ai";
import { CgMoreR } from "react-icons/cg";
import { BiSolidContact } from "react-icons/bi";
import { RiUserSearchFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import NewConversation from "../pages/NewGroup";
import { useNavigate } from "react-router-dom";
import AuthenticationContext from "../context/authContext";
import { useOutsideHover } from "../hooks/useOutsideHover";
import useAuth from "../hooks/useAuth";
import { useWebSocket } from "../context/WebSocketContext";

const Navbar = () => {
  const ref = useOutsideHover(() => {
    setToggle(false);
  },
  );

  const [toggle, setToggle] = useState(false);
  const {searchVal,setSearchVal} = useWebSocket();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
 


  const handleLogout = () => {
    setAuth({ username: "", accessToken: "", refreshToken: "", userId: "" });
    localStorage.clear();
  };

  const handleSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchVal(e.currentTarget.value);
  }

  const toggleStyle = `text-3xl flex flex-wrap content-center justify-center w-11 text-white `;
  return (
    <div ref={ref} className="bg-gray-600 h-max  flex flex-row w-full ">
      <button
        className={
          !toggle
            ? `${toggleStyle} bg-transparent text-gray-900 border-solid p-2 m-3`
            : `${toggleStyle}  bg-gray-500 text-gray-900 rounded-3xl p-2 m-3`
        }
        onClick={() => setToggle(!toggle)}
      >
        <CgMoreR />
      </button>
      <div className="flex flex-row bg-transparent items-center ml-auto">
        <input className="h-4/6 rounded-3xl bg-gray-500 border-2 border-gray-900 mr-6" placeholder="Search"
          value={searchVal}
          onChange={handleSearch}/>
        
      </div>
      
      <ul
        className={
          toggle
            ? `absolute top-11 flex-col  bg-gray-500 bg-opacity-90 rounded-md ml-4 mt-4 `
            : "hidden"
        }
      >
        <li>
          <button
            className="py-2 flex  w-56  border-solid text-white font-bold hover:bg-gray-700 hover: rounded-md duration-500"
            onClick={()=> navigate("/new-conversation")}
          >
            <AiOutlinePlusCircle  className=" text-3xl ml-5 mr-10" />
            New group
          </button>
        </li>
        
        <li>
          <button
            className="py-2  flex items-center  w-56  border-solid text-white font-bold hover:bg-gray-700 hover: rounded-md duration-500"
            onClick={() => navigate("/find-people")}
          >
            <RiUserSearchFill className="text-3xl ml-5 mr-10"/>
            Find people
          </button>
        </li>
        <li>
          <button
            className=" justify-center text-center py-2 flex items-center  w-56  border-solid text-white font-bold hover:bg-gray-700 hover: rounded-md  duration-500"
            onClick={()=> navigate('/friend-requests')}
          >
            Friend requests
          </button>
        </li>
        <li>
          <button
            className=" py-2 flex items-center  w-56  border-solid text-red-700 font-bold hover:bg-gray-700 hover: rounded-md  duration-500"
            onClick={handleLogout}
          >
            <BiLogOutCircle className=" text-3xl ml-5 mr-10"/>
            Log out
          </button>
         
        </li>
      </ul>

      {/* {newConvToggle && <NewConversation />} */}
    </div>
  );
};
export default Navbar;
