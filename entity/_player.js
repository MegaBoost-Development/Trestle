let Entity = require("./_entity.js");

class Player extends Entity {
  constructor(x, y, world, width, height, speed, name) {
    super(x, y, world, width, height, speed, name);
  }
}

module.exports = Player;
