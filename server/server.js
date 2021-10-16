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

  const socketId = uuidv4();
  socket.socketId = socketId;

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

        socket.gameId = gameId;
        socket.socketIndex = 1;

        console.log(socket.gameId);

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
      const indexOfPlayer = (games[gameId] && games[gameId].players || []).indexOf(playerId);
      if (indexOfPlayer != -1) {
        console.log(`${gameId} - subscribed player ${indexOfPlayer} socket`);
        games[gameId].sockets[indexOfPlayer] = socket;
        socket.gameId = gameId;
        socket.socketIndex = indexOfPlayer;
      } else {
        console.error(`${playerId} is not in ${gameId}`);
      }
    }
  });

  socket.on("submit_move", (payload) => {
    const {position} = payload;

    console.log("move");
    console.log(socket.socketId, games[socket.gameId].activeSmall.length != 0);


    if(!socket.gameId || !games[socket.gameId] || !("socketIndex" in socket) || !games[socket.gameId].sockets[socket.socketIndex] || games[socket.gameId].sockets[socket.socketIndex].socketId != socket.socketId || socket.socketIndex != games[socket.gameId].currentPlayer || (games[socket.gameId].activeSmall.length != 0 && (position[0] != games[socket.gameId].activeSmall[0] || position[1] != games[socket.gameId].activeSmall[1]))){

      if(!games[socket.gameId].sockets[socket.socketIndex]){
        console.log("fuck 1");
      }else if(games[socket.gameId].sockets[socket.socketIndex].socketId != socket.socketId){
        console.log("fuck 2");
      }else if(socket.socketIndex != games[socket.gameId].currentPlayer){
        console.log("fuck 3");
      }else if((games[socket.gameId].activeSmall.length != 0 && (position[0] != games[socket.gameId].activeSmall[0] || position[1] != games[socket.gameId].activeSmall[1]))){
        console.log("fuck 4");
      }

      console.log("submit_move_failed", games[socket.gameId].activeSmall.length != 0);
      socket.emit("submit_move_failed", {err: `something in the socket saving system failed (probably, idk)`});
      return;
    }

    games[socket.gameId] = calculateMove(position, games[socket.gameId], games[socket.gameId].sockets);
  });
});

// -------------- SOCKET --------------


const calculateMove = (position, gameState, socketsToInform) => {
  if(gameState.field.field[position[0]][position[1]].field[position[2]][position[3]] != 0){
    return {err:`field is not empty`};
  }

  gameState.field.field[position[0]][position[1]].field[position[2]][position[3]] = gameState.currentPlayer + 1;
  newCurrentPlayer = (gameState.currentPlayer + 1)%2;
  gameState.activeSmall = position.slice(2,4);


  const smallWinner = checkWin(gameState.field.field[position[0]][position[1]].field);
  gameState.field.field[position[0]][position[1]].won = smallWinner;

  const bigWinner = checkWin(gameState.field.field, x => x.won);

  const socketPayload = {position, value:gameState.currentPlayer + 1, newCurrentPlayer , newActiveSmall: gameState.activeSmall, smallWinner, bigWinner};
  socketsToInform.forEach(socket => socket.emit("move", socketPayload));

  gameState.currentPlayer = newCurrentPlayer;
  return gameState;
}

const checkWin = (arr, valueFunction /* mapping from (arr[i][j]) -> (playerIndex) */) => {
  if(!valueFunction)
    valueFunction = x => x;

  for(let i = 0; i < arr.length; i++){
    if(valueFunction(arr[i][0]) != 0){
      let win = true;
      for(let t = 0; t < 3; t++){
        if(valueFunction(arr[i][0]) != valueFunction(arr[i][t]))
          win = false;
      }
      if(win) return valueFunction(arr[i][0]);
    }
  }

  for(let j = 0; j < arr[0].length; j++){
    if(valueFunction(arr[0][j]) != 0){
      let win = true;
      for(let t = 0; t < 3; t++){
        if(valueFunction(arr[0][j]) != valueFunction(arr[t][j]))
          win = false;
      }
      if(win) return valueFunction(arr[0][j]);
    }
  }

  let win = true;
  for(let t = 0; t < 3; t++){
    if(valueFunction(arr[0][0]) != valueFunction(arr[t][t]))
      win = false;
  }
  if(win) return valueFunction(arr[0][0]);

  win = true;
  for(let t = 0; t < 3; t++){
    if(valueFunction(arr[0][2]) != valueFunction(arr[t][2- t]))
      win = false;
  }
  if(win) return valueFunction(arr[0][2]);

  return 0;
}

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
