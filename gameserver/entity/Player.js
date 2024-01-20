const Entity = require("./Entity.js");

class Player extends Entity {
  constructor(name, id, x, y, defaultSpeed, height, width, world) {
    super(name, id, x, y, defaultSpeed, height, width, world);

  }
}

module.exports = Player;
