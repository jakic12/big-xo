import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Loader from "react-loader-spinner";
import { createGame } from "../redux/helpers";
import { Redirect } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: white;
`;

const GreenButton = styled.div`
  padding: 0.5em;
  border-radius: 0.2em;
  background: #2ecc71;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

export default ({ socket }) => {
  const local_player_stuff = useSelector((state) => state.lps);
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <h1>Big boy XO</h1>
      <br />
      {local_player_stuff.done && (
        <Redirect to={`/game/${local_player_stuff.createdGameId}`} />
      )}
      {local_player_stuff.createdGame && <div>game created!</div>}
      {local_player_stuff.waitingForPlayer && (
        <div>waiting for other player...</div>
      )}
      {local_player_stuff.createdGame && (
        <div>{local_player_stuff.createdGameId}</div>
      )}
      {!local_player_stuff.createGameLoading &&
        !local_player_stuff.waitingForPlayer &&
        !local_player_stuff.done && (
          <GreenButton
            onClick={() =>
              dispatch(createGame(local_player_stuff.api_location, socket))
            }
          >
            Create game
          </GreenButton>
        )}
      {(local_player_stuff.createGameLoading ||
        local_player_stuff.waitingForPlayer) && (
        <div style={{ padding: `3em` }}>
          <Loader type="TailSpin" color="#3498db" height={100} width={100} />
        </div>
      )}
    </Wrapper>
  );
};
