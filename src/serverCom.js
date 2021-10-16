import { setState as setLocalPlayerState } from "./redux/local_player_stuff";

const api_location = `http://localhost:5000/`;

export const createGame = () =>
  new Promise((res, rej) => {
    setLocalPlayerState({ createdGameLoading: true });
    fetch(`${api_location}createGame`)
      .then((resp) => resp.json())
      .then((data) => {
        setLocalPlayerState({ playerIds: [data.playerId] });
      })
      .catch((err) => console.error(err));
  });
