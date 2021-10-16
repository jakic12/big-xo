import { createSlice } from "@reduxjs/toolkit";

const default_state = {
  playerId: false,
  createGameLoading: false,
  createdGame: false,
  waitingForPlayer: false,
  done: false,
  api_location: `http://localhost:5000/`,
  createdGameId: false,
};

export const local_stuff = createSlice({
  name: "gameState",
  initialState: default_state,
  reducers: {
    setState: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetState:(state) => {
      Object.keys(state).forEach((key) => {
        delete state[key];
      })

      Object.assign(state, default_state);
    },
  },
});

export const { setState, resetState } = local_stuff.actions;

export default local_stuff.reducer;
