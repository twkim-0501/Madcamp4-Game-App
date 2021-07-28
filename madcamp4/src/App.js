import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/login'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import GamePage from './components/views/GamePage/GamePage'
import Scroll from './components/views/Scroll/scroll'
import Auth from './hoc/auth'
import MG_GamePage from "./components/views/GamePage/MG_GamePage";
import Choose from './components/views/Choose/choose'


function App() {

  return (
    <Router>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/gamepage" component={Auth(MG_GamePage, true)} />
          <Route exact path="/gamepage2" component={GamePage} />
          <Route exact path="/scroll" component={Auth(Scroll, true)} />
          <Route exact path="/choose" component={Choose} />
        </Switch>
    </Router>
  );
}


export default App;
