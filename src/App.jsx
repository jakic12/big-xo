import React from "react";
import BigTable from "./components/BigTable";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import GameScreen from "./screens/gameScreen";
import CreateGame from "./screens/createGame";
import { io } from "socket.io-client";

const socket = io(`http://localhost:5000/`);

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <CreateGame socket={socket} />
        </Route>
        <Route exact path="/game/:gameId">
          <GameScreen socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
