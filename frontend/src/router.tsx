/** @format */

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import TopPage from "./page/TopPage/TopPage";
import Room from "./page/Room/Room";

const PathDefs = {
  root: "/",
  room: "/room",
};

const routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={PathDefs.root} component={TopPage} />
        <Route exact path={PathDefs.room} component={Room} />
        <Redirect to={PathDefs.root} />
      </Switch>
    </Router>
  );
};

export default routes;
