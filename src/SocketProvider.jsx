import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import GameScreen from "./screens/gameScreen";
import CreateGame from "./screens/createGame";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setState } from "./redux/local_player_stuff";
import { link } from "./server_link";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SocketProvider = () => {
  const gameState = useSelector((state) => state.lps);
  const dispatch = useDispatch();
  const api_link = useQuery().get("server") || link;
  useEffect(() => {
    if (gameState.api_location != api_link) {
      dispatch(setState({ api_location: api_link }));
    }
  }, []);
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
