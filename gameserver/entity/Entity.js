const Location = require("../position/Location.js");

class Entity {

  #name;
  #id;
  #location;
  #speed;
  #defaultSpeed;
  #height;
  #width;
  #world;
  #xVel;
  #yVel;

  constructor(name, id, x, y, defaultSpeed, height, width, world) {
    this.#name = name;
    this.#id = id;
    this.#location = new Location(x, y, world);
    this.#speed = defaultSpeed;
    this.#defaultSpeed = defaultSpeed;
    this.#height = height;
    this.#width = width;
    this.#world = world;
    this.#xVel = 0;
    this.#yVel = 0;
  }

  getName() {
    return this.#name;
  }

  getId() {
    return this.#id;
  }

  getLocation() {
    return this.#location;
  }

  getSpeed() {
    return this.#speed;
  }

  resetSpeed() {
    this.#speed = this.getDefaultSpeed();
  }

  setSpeed(speed) {
    this.#speed = speed;
  }

  speedUp(amount) {
    this.setSpeed(this.getSpeed() + amount);
  }

  slowDown(amount) {
    this.setSpeed(this.getSpeed() - amount);
  }

  getDefaultSpeed() {
    return this.#defaultSpeed;
  }


}

module.exports = Entity;
