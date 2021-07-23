import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";
//import './App.css';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import MG_GamePage from "./components/views/GamePage/MG_GamePage";


function App() {
  return (
    <Router>
    <div>

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage } />
        <Route exact path="/gamepage" component={MG_GamePage}/>
      </Switch>
      
    </div>
  </Router>
  );
}



export default App;
