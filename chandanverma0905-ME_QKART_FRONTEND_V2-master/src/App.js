import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import React from "react";
import Login from "./components/Login";
import Products from "./components/Products";
import theme from "./theme.js";
import {ThemeProvider} from "@mui/material/styles";
import {Switch, Route} from "react-router-dom";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
 
  // const customTheme = createTheme(theme);// create theme instance from theme.js
  
// The purpose of <React.StrictMode> is to enable various checks and warnings for potential problems in your application during development. Wrapping your entire app within it is a good practice as it helps catch and highlight potential issues early.
// Similarly, wrapping your components with <ThemeProvider> ensures that the Material-UI theme is applied to all components within the wrapped structure. 
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
    <div className="App">
     
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          
          {/* <Router></Router> is the updated version instead of Switch */}
            <Switch>
              <Route exact path="/" component={Products} />
              <Route path= "/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/checkout" component={Checkout}/>
              <Route path="/thanks" component={Thanks}/>
            </Switch>
          
    </div>
       </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
