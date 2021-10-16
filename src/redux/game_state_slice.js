import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: {},
  reducers: {
    setData: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetData:(state) => {
      Object.keys(state).forEach((key) => {
        delete state[key];
      })
    },
    move: (state, action) => {
      const { position, value, newCurrentPlayer, newActiveSmall, smallWinner, bigWinner } = action.payload;
      state.field.field[position[0]][position[1]].field[position[2]][
        position[3]
      ] = value;
      state.currentPlayer = newCurrentPlayer;
      state.field.field[position[0]][position[1]].won = smallWinner;
      state.winner = bigWinner;
      state.activeSmall = newActiveSmall;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setData, move, resetData } = gameStateSlice.actions;

export default gameStateSlice.reducer;
