import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
// import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
   
  const history = useHistory();
  const isLoggedIn = localStorage.getItem("token"); // to just check if user is logged in or not. when token get extracted then we say that a User is logged in 
  
  return (
  
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon" onClick={()=>{history.push("/")}}></img>
        </Box>
        
        {children}
        {hasHiddenAuthButtons ? 
          ( <Button
           className="explore-button"
           startIcon={<ArrowBackIcon />}
           variant="text"
           onClick={()=>{history.push("/")}}
          >
           Back to explore
         </Button> ):  isLoggedIn ? 
         (<span > 
          <Avatar src="avatar.png" alt ={localStorage.getItem("username")} />
          
          <span> {localStorage.getItem("username")} </span>
          
         <Button variant="text" onClick={()=>{ localStorage.clear();  window.location.reload();} }>Logout</Button> 
         
         </span>) : 
         (<span> 
          <Button variant="text" onClick={()=>{history.push("/login")}}>Login</Button> 
          <Button variant="contained" onClick={()=>{history.push("/register")}}> Register </Button>
         </span>)
         

        }
        
      </Box>
      )
      
  };  
  
  export default Header;
