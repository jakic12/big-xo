import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: {},
  reducers: {
    setData: (state, action) => {
      Object.assign(state, action.payload);
    },
    move: (state, action) => {
      const { position, value, newCurrentPlayer, newActiveSmall } = action;
      state.field.field[position[0]][position[1]].field[position[2]][
        position[3]
      ] = value;
      state.currentPlayer = newCurrentPlayer;
      state.activeSmall = newActiveSmall;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setData, move } = gameStateSlice.actions;

export default gameStateSlice.reducer;
