import React from "react";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import GameScreen from "./screens/gameScreen";
import CreateGame from "./screens/createGame";
import { io } from "socket.io-client";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SocketProvider = () => {
  const api_link = useQuery().get("server") || `http://localhost:5000/`;
  console.log(api_link);
  const socket = io(api_link);
  return (
    <>
      <Route exact path="/">
        <CreateGame socket={socket} />
      </Route>
      <Route exact path="/game/:gameId">
        <GameScreen socket={socket} />
      </Route>
    </>
  );
};

export default SocketProvider;
