/** @format */

import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import TopPage from "./page/TopPage/TopPage";
import Room from "./page/Room/Room";

const PathDefs = {
  top: "/",
  room: "/room/:roomId",
};

const routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={PathDefs.top} component={TopPage} />
        <Route exact path={PathDefs.room} component={Room} />
        <Redirect to={PathDefs.top} />
      </Switch>
    </Router>
  );
};

export default routes;
