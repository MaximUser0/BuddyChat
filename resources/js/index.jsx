import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

import "../css/reset.css";
import "../css/style.css";
import "../css/app.css";
import "./bootstrap";


ReactDOM.createRoot(document.getElementById("app")).render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
);
