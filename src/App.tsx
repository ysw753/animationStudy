import styled from "styled-components";
import { motion } from "framer-motion";
import React from "react";
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Header from "./components/Header";
import TV from "./Routes/Tv";

function App() {

  
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <TV />
        </Route>
        <Route path={["/search","/search/:movieId"]}>
          <Search />
        </Route>
        <Route path={[`${process.env.PUBLIC_URL}/`,"/movies/:movieId"]}>
          <Home />
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
