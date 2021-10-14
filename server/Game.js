const { v4: uuidv4, v1: uuidv1 } = require("uuid");

class Game {
  constructor() {
    this.id = uuidv1();

    this.field = new BigField();

    //players
    this.players = [uuidv4()];

    //playtime vars
    this.started = false;
    this.currentBig = undefined; //coords
    this.currentPlayer;
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
    this.field = new Array(3).fill(0).map(() => new Array(3).fill(false));
  }
}

module.exports = {
  Game,
};
