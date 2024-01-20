class Entity {

  #name;
  #id;
  #x;
  #y;
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
    this.#x = x;
    this.#y = y;
    this.#speed = defaultSpeed;
    this.#defaultSpeed = defaultSpeed;
    this.#height = height;
    this.#width = width;
    this.#world = world;
  }
}

module.exports = Entity;
