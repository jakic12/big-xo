const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 5000;
const cors = require("cors");

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { Game } = require("./Game");

var games = {};

// fuck cors
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello 1i234-0i230-4i23-0i-!");
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
  console.log(req);
  const gameId = req.params.gameId;
  if (!gameId) {
    res.status(400).json({ err: "gameId param missing" });
    return;
  }
  if (!games[gameId]) {
    res.status(404).json({ err: "game not found" });
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
      res.json({
        game: Object.assign({}, games[gameId], { sockets: undefined }),
      });
      return;
    }

    res.status(403).json({
      err: `player ${playerId} is not in this game`,
    });
    return;
  }

  res.json({});
});

// -------------- SOCKET --------------
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("subscribe_player", (payload) => {
    const { playerId, gameId } = payload;
    console.log(payload);
    console.log(`${playerId} joined ${gameId}`);

    if (!gameId) {
      console.error("socket connected without gameId");
      socket.emit("subscribe_player_error", {
        err: "socket connected without gameId",
      });
      return;
    }
    if (!games[gameId]) {
      console.error("socket connected to a non existing game");
      socket.emit("subscribe_player_error", {
        err: "socket connected to a non existing game",
      });
      return;
    }

    if (!playerId) {
      if (games[gameId].players.length == 1) {
        const newPlayerId = uuidv4();
        games[gameId].players[1] = newPlayerId;
        games[gameId].started = true;
        games[gameId].currentPlayer = 0;
        games[gameId].sockets[1] = socket;
        console.log(`${gameId} - subscribed player 1 socket`);

        if (games[gameId].sockets[0]) {
          games[gameId].sockets[0].emit("game_start");
          console.log(`game_start sent!`);
        } else {
          console.log("no socket was listening :(");
        }

        socket.emit("subscribe_player_success", {
          playerId: newPlayerId,
        });
        return;
      }
      if (games[gameId].players.length >= 2) {
        console.error("socket connected to a full game");
        socket.emit("subscribe_player_error", {
          err: "socket connected to a full game",
        });
        return;
      }
    } else {
      const indexOfPlayer = (games[gameId]?.players || []).indexOf(playerId);
      if (indexOfPlayer != -1) {
        console.log(`${gameId} - subscribed player ${indexOfPlayer} socket`);
        games[gameId].sockets[indexOfPlayer] = socket;
      } else {
        console.error(`${playerId} is not in ${gameId}`);
      }
    }
  });

  //TODO: handle move

  //socket.on("move");
});

// -------------- SOCKET --------------

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
