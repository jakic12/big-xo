const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 5000;

const { Game } = require("./Game");

var games = {};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * req: post create game
 * args: none
 * returns playerId (the generated id of the player that created the game), gameId
 */
app.post("/createGame", (req, res) => {
  const newGame = new Game();
  games[newGame.id] = newGame;
  res.json({ playerId: newGame.players[0], gameId: newGame.id });
});

app.get("/game/:gameId", (req, res) => {
  const playerId = req.headers.playerid;
  const gameId = req.params.gameId;
  if (!gameId) {
    res.status(400).json({ err: "gameId param missing" });
    return;
  }
  if (!games[gameId]) {
    res.status(404).json({ err: "game not found" });
    return;
  }

  if (games[gameId].players.length == 1) {
    const newPlayerId = uuidv4();
    games[gameId].players.push(newPlayerId);
    games[gameId].started = true;
    res.json({ playerId: newPlayerId, game: games[gameId] });
    return;
  }

  if (!playerId) {
    if (games[gameId].players.length >= 2) {
      res.status(403).json({ err: "game full" });
      return;
    }
  }

  if (playerId) {
    if (games[gameId].players.includes(playerId)) {
      res.json({ game: games[gameId] });
      return;
    }

    res.status(403).json({ err: "user is not in this game" });
    return;
  }

  res.status(500).json({ err: "this should not have happened!" });
  console.error("this should not have happened! req:");
  console.log(req);
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
