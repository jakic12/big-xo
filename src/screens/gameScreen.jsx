import React, { useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import BigTable from "../components/BigTable";
import { useSelector, useDispatch } from "react-redux";
import { fetchGame, subscribeSocket } from "../redux/helpers";
import styled from "styled-components";

const WinnerOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 5em;
`;

export default ({ socket }) => {
  const gameState = useSelector((state) => state.gameState);
  const lps = useSelector((state) => state.lps);
  const dispatch = useDispatch();
  const { gameId } = useParams();

  useEffect(() => {
    if (lps.playerId && (!gameState.err || !gameState.id)) {
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

  if (gameState.id)
    return (
      <>
        <BigTable socket={socket} />
        {gameState.winner != 0 &&
          gameState.winner &&
          gameState.winner != false && (
            <>
              {gameState.winner == -1 && (
                <WinnerOverlay style={{ color: `#2ecc71` }}>
                  It's a tie :/
                </WinnerOverlay>
              )}
              {gameState.winner != -1 &&
                gameState.players.indexOf(lps.playerId) ==
                  gameState.winner - 1 && (
                  <WinnerOverlay style={{ color: `#2ecc71` }}>
                    You won :)
                  </WinnerOverlay>
                )}
              {gameState.winner != -1 &&
                gameState.players.indexOf(lps.playerId) !=
                  gameState.winner - 1 && (
                  <WinnerOverlay style={{ color: `#f14666` }}>
                    You lost :(
                  </WinnerOverlay>
                )}
            </>
          )}
      </>
    );
  return <div>loading</div>;
};
