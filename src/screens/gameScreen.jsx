import React, { useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import BigTable from "../components/BigTable";
import { useSelector, useDispatch } from "react-redux";
import { fetchGame, subscribeSocket } from "../redux/helpers";

export default ({ socket }) => {
  const gameState = useSelector((state) => state.gameState);
  const lps = useSelector((state) => state.lps);
  const dispatch = useDispatch();
  const { gameId } = useParams();

  useEffect(() => {
    if (gameState.err || !gameState.id) {
      dispatch(fetchGame(lps.api_location, gameId, lps.playerId));
    }
  }, [lps.playerId]);

  useEffect(() => {
    console.log("playerId or gameId changed, resubscribing socket");
    if (lps.playerId) {
      dispatch(
        subscribeSocket(socket, {
          playerId: lps.playerId,
          gameId: gameId,
        })
      );
    } else {
      dispatch(
        subscribeSocket(socket, {
          gameId: gameId,
        })
      );
    }
  }, [lps.playerId, gameState.id]);

  if (gameState.err) {
    return <Redirect to={`/`} />;
  }

  if (!lps.playerId) {
    return <div style={{ color: `white` }}>fetching player id</div>;
  }

  if (gameState.id) return <BigTable socket={socket} />;
  return <div>loading</div>;
};
