import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../Styles/myvariables";
import { useDispatch, useSelector } from "react-redux";
import "../Styles/Navbar.scss";
import { setLogout } from "../redux/state";
function Navbar() {
  const [dropDown, setDropDown] = useState(false);
  const admin = useSelector((state) => state.user.admin);
  const user= useSelector((state) => state.user)
  
  const navigate=useNavigate()

  const dis = useDispatch();
  const [search, setSearch] = useState("");

  const handleClick=()=>{
    if(search!==""){
    navigate(`/search/${search}`)
    }
  }

  return (
    <div className="navbar">
      <Link className="navbar_host" to="/">
        <img style={{borderRadius:"50%", marginLeft:"30px"}} src="/assets/magnet.jpg" alt="" />
      </Link>
      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search...."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <IconButton onClick={handleClick}>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>
      <div className="navbar_right">
        
        <button
          onClick={() => {
            setDropDown(!dropDown);
          }}
          className="navbar_right_account"
        >
          <Menu sx={{ color: variables.darkgrey }}></Menu>
          
          <img
              src={`http://localhost:9000/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />

         
        </button>
        {dropDown && !admin && (
          <div className="navbar_right_accountmenu">
            <Link to="/UserDisplay">Assigned Taks</Link>
            <Link to="/Login" onClick={()=>{dis(setLogout())}}>Log out</Link>
          </div>
        )}
        {dropDown && admin && (
          <div className="navbar_right_accountmenu">
            
            <Link to="/CreateTask">Create Task</Link>
            <Link to="/InsertUser">Create User</Link>
            <Link to="/ShowAllUser">Show All User</Link>
            <Link to="/ShowAllTasks">Show All Task</Link>
            <Link to="/PriorityManagement">Priority Management</Link>
            <Link to="/Dashboard">Dashboard</Link>


            <Link
              to="/Login"
              onClick={() => {
                dis(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
