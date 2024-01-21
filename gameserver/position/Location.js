const CONFIG = require("../../config.json");

class Location {

  #x;
  #y;
  #world;

  constructor(x = 0, y = 0, world = CONFIG.gameServer.defaultGameWorld) {
    this.#x = x;
    this.#y = y;
    this.#world = world;
  }

  static CoordinateInstance(x, y) {
    return new Location(x, y, null);
  }

  getX() {
    return this.#x;
  }

  setX(x) {
    this.#x = x;
  }

  getY() {
    return this.#y;
  }

  setY(y) {
    this.#y = y;
  }

  getWorld() {
    return this.#world;
  }

  setWorld(world) {
    this.#world = world;
  }

  isSameLocation(loc) {
    return this.getX() == loc.getX() && this.getY() == loc.getY() && this.getWorld() == loc.getWorld();
  }

}

module.exports = Location;
