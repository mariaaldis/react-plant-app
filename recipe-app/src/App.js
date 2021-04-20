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

function App() {
  return (
    <div className="App">
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
