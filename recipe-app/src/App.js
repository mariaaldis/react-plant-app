import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Nav from './Common/Nav/Nav';
import './App.scss';

import CreateRecipe from './Pages/CreateRecipe/CreateRecipe';
import Dashboard from './Pages/Dashboard/Dashboard';
import Recipe from './Pages/Recipe/Recipe';
import Auth from './Pages/Auth/Auth';
import UserInfo from './Pages/Auth/UserInfo';

function App() {
  return (
    <div className="App">
      <Router>
      <Route path="/auth" exact component={Auth}></Route>
      <Route path="/profile-information" exact component={UserInfo}></Route>
        <Switch>
          <Route path="/" exact component={Dashboard}></Route>
          <Route path="/recipe/:id" exact component={Recipe}></Route>
          <Route path="/create-recipe" component={CreateRecipe}></Route>
          <Route path="/profile"></Route>
        </Switch>
        
        <Nav/>
      </Router>
     
    </div>
  );
}

export default App;
