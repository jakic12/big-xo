import React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import SocketProvider from "./SocketProvider";

const App = () => {
  return (
    <Router>
      <Switch>
        <SocketProvider />
      </Switch>
    </Router>
  );
};

export default App;
