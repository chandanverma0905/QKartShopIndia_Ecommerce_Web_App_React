import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import theme from "./theme";


ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
        <SnackbarProvider
          maxSnack={1}  // max number of snackbar enqued at a particular time.
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
  </React.StrictMode>
   </BrowserRouter>
  ,
   document.getElementById('root')
);
