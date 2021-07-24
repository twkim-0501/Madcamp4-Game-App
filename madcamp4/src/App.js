import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";
//import './App.css';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'
import MG_GamePage from "./components/views/GamePage/MG_GamePage";



function App() {

  return (
    <Router>
      <div>

        <Switch>
          <Route exact path="/" component={Auth(LandingPage, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/gamepage" component={Auth(MG_GamePage, true)} />
        </Switch>

      </div>
    </Router>
  );
}


export default App;
