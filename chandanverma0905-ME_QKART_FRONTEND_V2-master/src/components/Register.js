import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import {Link, useHistory} from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();  
  
  const history = useHistory();
  
  const [loading, setLoading] = useState(false);
  
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
   
  //step 1: Adding state and event handlers appropriately to the input elements to keep track of the form data a Customer fills in
   const [formData, setFormData]= useState({
       username: "",
       password:"",
       confirmPassword:""
   });

    const handleInputChange = (event) =>{
      const {name, value} = event.target;
      
      setFormData({...formData, [name]:value });  // [] not an array, but we are accessing the values either use [] or ""
      
    };
   
    /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   * 
   * 
   * 
   * 
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *  
   *  API endpoint - "POST /auth/register"
   *  
   *  Example for successful response from backend for the API call:
   *  HTTP 201
   *  {
   *      "success": true,
   *  }
   *  
   *  Example for failed response from backend for the API call:
   *  HTTP 400
   *  { 
   *      "success": false,
   *      "message": "Username is already taken"
   *  }
   */ 

   // step 2: Implementing the register function 
  //  Use the register function given to you in the Register component as event handler for the register button

  const register = async (formData) => {
    
    setLoading(true);

    const filledData = {username:formData.username, password:formData.password}; 
    try{
      const response = await axios.post(`${config.endpoint}/auth/register`, filledData);
        console.log("Request data", filledData);
    if(response.status === 201){
      // Registration successful, show success message
      enqueueSnackbar("Registered successfully", {variant: "Success"});
         
           history.push("/login");
          
         }
         
  
       }

  catch(error){
    if (error.response && error.response.status===400)  // if backend is not running then error.response
    {
      enqueueSnackbar(error.response.data.message,{
        variant:'error'
      })
    } 
     else {
      enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON",{
        variant:'error'
             })
           }
       };
 

  setLoading(false);
  }

  
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   * 
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   * 
   * @returns {boolean}
   *    Whether validation has passed or not
   * 
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */

  // Function to validate the form input
  const validateInput = (data) => {
     
    if(data.username === "")
    {
      enqueueSnackbar("Username is a required field", {variant: "error"});
      return false;
    }
     
    if(data.username.length < 6)
    {
       enqueueSnackbar("Username must be at least 6 characters", {variant:"error"});
       return false;
    }

    if(data.password === "")
    {
      enqueueSnackbar("Password is a required field", {variant: "error"});
      return false;
    }
      
    if(data.password.length < 6)
    {
      enqueueSnackbar("Password must be atleast 6 characters", {variant:"error"});
      return false;
    }

    if(data.password !== data.confirmPassword)
    {
      enqueueSnackbar("Passwords do not match", {variant: "error"});
      return false;
    }

    return true;
  };

  //Event handler for form submission
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(validateInput(formData)){
      register(formData);
    }
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
        
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleInputChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />


{/* conditional rendering-->loading ? if cond true 1st cond follows: if cond false then this follows */}

{/* first the state of loading is set to false that means the button then as we click the button register now the state of loading will set to true and then as soon as it fetches the data using try and catch (dont care about success or error), the thing is that after getting success or error we have to set the loading state anaimation to false i.e it shows the register now button. The loading depends upon the fetch api as we click on the register now button, so the setLoading function will be inside the register function */}

    {loading ? <Box sx={{ display: 'flex' }} justifyContent="center">
      <CircularProgress  />
    </Box> : <Button className="button" variant="contained" onClick={handleSubmit} type="submit">
            Register Now
           </Button> }
          
          

          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login" className="link">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
