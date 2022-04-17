class Entity {
  constructor(x, y, world, width, height, speed, name) {
    this.x = x;
    this.y = y;
    this.world = world;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.name = name;
    this.currentBlock;
  }


  knockback() {

  }

  damage() {

  }


}

module.exports = Entity;
