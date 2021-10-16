import { setState as setLocalPlayerState } from "./local_player_stuff";
import { useSelector } from "react-redux";
import { move, setData as setGameData } from "./game_state_slice";

export const createGame = (api_location, socket) => {
  return (dispatch) => {
    dispatch(
      setLocalPlayerState({
        createGameLoading: true,
        createdGame: false,
        waitingForPlayer: false,
        done: false,
        createdGameId: false,
      })
    );

    fetch(`${api_location}createGame`, { method: `POST` })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch(
          setLocalPlayerState({
            playerId: data.playerId,
            createGameLoading: false,
            createdGame: true,
            waitingForPlayer: true,
            done: false,
            createdGameId: data.gameId,
          })
        );
        dispatch(subscribeSocket(socket, data));
        socket.on("game_start", () => {
          console.log("game_start recieved!");
          dispatch(
            setLocalPlayerState({
              createGameLoading: false,
              createdGame: true,
              waitingForPlayer: false,
              done: true,
            })
          );
        });
      })
      .catch((err) => {
        setLocalPlayerState({
          createGameLoading: false,
          createdGame: false,
          waitingForPlayer: false,
          done: false,
        });
        console.error(`error at trying to create game`);
        console.error(err);
      });
  };
};

export const subscribeSocket =
  (socket, { playerId, gameId }) =>
  (dispatch) => {
    socket.emit(`subscribe_player`, { playerId, gameId });
    socket.on(
      "move",
      ({ position, value, newCurrentPlayer, newActiveSmall }) => {
        dispatch(move({ position, value, newCurrentPlayer, newActiveSmall }));
      }
    );
    socket.on(`subscribe_player_success`, ({ playerId }) => {
      dispatch(setLocalPlayerState({ playerId }));
    });
    socket.on(`subscribe_player_error`, ({ err }) => {
      console.error(err);
      dispatch(setGameData({ err }));
    });
  };

export const fetchGame = (api_location, gameId, playerId) => {
  return (dispatch) => {
    const headers = {};
    if (playerId) headers.playerId = playerId;
    console.log({ headers });
    fetch(`${api_location}game/${gameId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          throw Error(data.err);
          return;
        }
        dispatch(setGameData(Object.assign(data.game || {}, { err: false })));
      })
      .catch((err) => {
        console.error("at fetchGame");
        console.error(err);
        dispatch(
          setLocalPlayerState({
            playerId: false,
            createGameLoading: false,
            createdGame: false,
            waitingForPlayer: false,
            done: false,
            createdGameId: false,
          })
        );
        dispatch(setGameData({ err: err }));
      });
  };
};
