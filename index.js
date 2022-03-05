import React from "react";
import ReactDOM from "react-dom";
import LoginPage from "./src/pages/Login";
import DashboardPage from "./src/pages/Dashboard";
import Cookies from "universal-cookie"

const cookies = new Cookies();

ReactDOM.render(
    <React.StrictMode>
        {
            cookies.get('x-auth-token') ? <DashboardPage /> : <LoginPage />
        }
    </React.StrictMode>
    , document.getElementById('root')
)
