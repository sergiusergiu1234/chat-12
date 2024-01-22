import { AiOutlinePlusCircle } from "react-icons/ai";
import Button from "./Button";
import { CgMoreR } from "react-icons/cg";
import "../styles/Navbar.css";
import { useContext, useState } from "react";
import NewConversation from "./NewGroup";
import { useNavigate } from "react-router-dom";
import AuthenticationContext from "../context/authContext";
const Navbar = () => {

    const [toggle,setToggle] = useState(false);
    const [newConvToggle,setNewConvToggle] = useState(false);
    const {setAuth} = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const createConversationPage = () => {
        // Navigate to the new conversation page
        navigate('/new-conversation');
      };

      const handleLogout = () =>{
        setAuth({username:'',accessToken:'',refreshToken:'',userId:''});
        localStorage.clear();
      }
    return (<div className="navbar">
        <div className="navbar-container">
            <Button onClick={()=>setToggle(!toggle)}><CgMoreR /></Button>
            <ul className={toggle ? 'navbar-menu active' : 'navbar-menu'}>
                <li><Button onClick={createConversationPage}><AiOutlinePlusCircle /> New group</Button></li>
                <li><Button onClick={()=> navigate('/friends')}>Friends</Button></li>
                <li><Button onClick={()=>navigate("/find-people")}>Find people</Button></li>
                <li><Button onClick={handleLogout}>Log out</Button></li>
            </ul>
        </div>
       {newConvToggle && <NewConversation/>}
        
    </div>)
}
export default Navbar;