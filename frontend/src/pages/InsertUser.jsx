import React, { useState } from 'react';
import Navbar from "../Components/Navbar";
import axios from 'axios';


function InsertUser() {
  const [matchPassword,setMatchPassword]=useState(true);

  const wrongpass=<> <p style={{color:"red"}}> password not matched </p></>
  const [user, setUser] = useState({
    
    username: '',
    password: '',
    confirmPassword:"",
    profileImage:null
  });

  const handleChange = (e) => {
    const { name, value,files } = e.target;
    console.log(user)
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(user.password!=user.confirmPassword){
      setMatchPassword(false)
    }
    // Add your API call or logic for submitting user data
    else{
   
      
        const register_form = new FormData()

         for (var key in user) {
           register_form.append(key, user[key])
          }

          const url="http://localhost:9000/user/Create"
      axios.post(url,register_form).then((res)=>{
        alert("user created")
        console.log(res.data)
        setUser({
    
          username: '',
          password: '',
          confirmPassword:"",
          profileImage:null
        })
      }).catch((err)=>{
        console.log(err)
      })
      }
      

      
    
  };

  return (
    <>
      <Navbar />
      <div className="register">
        
        <div className="register_content">
          <form className="register_content_form" onSubmit={handleSubmit}>
          
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
            {(!matchPassword && wrongpass)}
            <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            
          />

            <label htmlFor='image'>
              <img src="/assets/addImage.png" alt="add profile photo" />
                <p>Upload Your Photo</p>
                </label>

                {user.profileImage && (
            <img
              src={URL.createObjectURL(user.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
            
            <button type="submit">Insert User</button>
          </form>
        </div>
      </div>
    </>
  );

}
export default InsertUser;
