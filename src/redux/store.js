import { configureStore } from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import logger from "redux-logger";

import gameStateReducer from "./game_state_slice";
import localPlaterStuffReducer from "./local_player_stuff";

export default configureStore({
  reducer: {
    gameState: gameStateReducer,
    lps: localPlaterStuffReducer,
  },
  middleware: [thunk, logger],
});
