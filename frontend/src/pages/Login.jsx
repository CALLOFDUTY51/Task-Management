
import React, { useState } from "react";
import "../Styles/Login.scss"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../redux/state";
function Login() {
    const [tag,setTag]=useState(true);


    
    const navigate=useNavigate();
    const dis=useDispatch();

    const [MyData, setMyData] = useState({
        username: "",
        password: ""
      });
     
    
      const handleChange = (e) => {
        const { name, value } = e.target;
    
        setMyData({
          ...MyData,
          [name]: value,
        });
      };
    
      
      
    
      const handleSumbit = (e) => {
        e.preventDefault();
        // Logic to handle form submission
        const url="http://localhost:9000/user/LogIn";
        
    
        
        axios.post(url,MyData).then((res)=>{
          
          dis(setLogin(res.data))
          if(res.data.admin){
            navigate("/Dashboard")
          }
          else{
            navigate("/UserDisplay")   
          }
          
          
        }).catch((err)=>{
            console.log(err)
        })
    
      };
    
      
  return (
    <div className="register">
            <h2>Login</h2>

    <div className="register_content">
      <form className="register_content_form" onSubmit={handleSumbit}>
        <input
          type="text"
          value={MyData.username}
          placeholder="UserName"
          name="username"
          onChange={handleChange}
          required
        />
        <input
          value={MyData.password}
          placeholder="Password"
          name="password"
          onChange={handleChange}
          type="password"
          required
        />
        <button type="submit">LogIn</button>
       
      </form>
      
    </div>
  </div>
  )
}

export default Login