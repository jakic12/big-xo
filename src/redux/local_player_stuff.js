import { createSlice } from "@reduxjs/toolkit";

export const local_stuff = createSlice({
  name: "gameState",
  initialState: {
    playerId: false,
    createGameLoading: false,
    createdGame: false,
    waitingForPlayer: false,
    done: false,
    api_location: `http://localhost:5000/`,
    createdGameId: false,
  },
  reducers: {
    setState: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setState } = local_stuff.actions;

export default local_stuff.reducer;
