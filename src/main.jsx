import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./context/FirebaseAuthContext";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserAuthContextProvider>
  </React.StrictMode>
);
