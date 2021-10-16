const { v4: uuidv4, v1: uuidv1 } = require("uuid");

class Game {
  constructor() {
    this.id = uuidv1();

    this.field = new BigField();

    //players
    this.players = [uuidv4()];

    //playtime vars
    this.started = false;
    this.initialized = false; // has the first field been selected?
    this.currentBig = undefined; //coords
    this.currentPlayer;
    this.sockets = [];
    this.activeSmall = [];
  }
}

class BigField {
  constructor() {
    this.field = new Array(3)
      .fill(0)
      .map(() => new Array(3).fill(0).map(() => new SmallField()));
  }
}

class SmallField {
  constructor() {
    this.won = 0; //1 2 or 0
    this.full = false;
    this.field = new Array(3).fill(0).map(() => new Array(3).fill(0));
  }
}

module.exports = {
  Game,
};
