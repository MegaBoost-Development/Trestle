const Entity = require("./Entity.js");
const Location = require("../position/Location.js");

class Player extends Entity {

  #cursorAngle;
  #mouseScreenLocation;

  constructor(name, id, x, y, defaultSpeed, height, width, world) {
    super(name, id, x, y, defaultSpeed, height, width, world);

    this.#cursorAngle = 0;
    this.#mouseScreenLocation = new Location();
  }

  setCursorAngle(angle) {
    this.#cursorAngle = angle;
  }

  getCursorAngle() {
    return this.#cursorAngle;
  }

  setMouseScreenLocation(location) {
    this.#mouseScreenLocation = location;
  }

  getMouseScreenLocation() {
    return this.#mouseScreenLocation;
  }

}

module.exports = Player;
