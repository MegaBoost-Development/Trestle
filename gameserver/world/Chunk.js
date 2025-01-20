const Block = require("./Block.js");

class Chunk {

  static CHUNK_WIDTH = 800;
  static CHUNK_HEIGHT = 800;
  #chunkPosition;
  #loaded;
  #entities;
  #blocks;

  constructor(chunkPosition) {
    this.#chunkPosition = chunkPosition;
    this.#loaded = true;
    this.#entities = new Map();
    this.#blocks = [];

    this.#generate();
  }

  #generate() {
    const world = this.getChunkPosition().getWorld();
    const noise2D = world.getNoise2D();
    const offsetX = this.getChunkPosition().getX() * 800;
    const offsetY = this.getChunkPosition().getY() * 800;

    const seed = world.getSeed();
    const oh = seed * 1024.0;
    const or = seed * 1024.0;

    let blockX;
    let blockY;
    let x;
    let y;
    let nh;
    let nr;
    let dist;
    let noise;
    for (let chunkY = 0; chunkY < 16; chunkY++) {
      let generatedBlocks = [];
      for (let chunkX = 0; chunkX < 16; chunkX++) {
        blockX = offsetX + (Block.BLOCK_WIDTH * chunkX);
        blockY = offsetY + (Block.BLOCK_HEIGHT * chunkY);
        x = blockX / Block.BLOCK_WIDTH;
        y = blockY / Block.BLOCK_HEIGHT;

        nh = this.#safepow(noise2D(x / 12.0, y / 12.0), 1.1);
        nr = noise2D(x / 8.0, y / 8.0);

        dist = this.#norm(Math.abs(x - (offsetX / 2.0)) / (offsetX / 2.0), Math.abs(y - (offsetY / 2.0)) / (offsetY / 2.0));
        noise = nh + (nr * 0.5) + (dist > (1.0 - (32 * (1.0 / offsetX))) ? -0.3 : 0.0);
        generatedBlocks.push(new Block(world, blockX, blockY, chunkX, chunkY, world.getBlockClassFromHeight(noise)));
      }
      this.#blocks.push(generatedBlocks);
    }

  }

  #norm(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  #safepow(x, e) {
    return Math.sign(x) * Math.abs(Math.pow(Math.abs(x), e));
  }

  getChunkPosition() {
    return this.#chunkPosition;
  }

  getChunkX() {
    return this.#chunkPosition.getX();
  }

  getChunkY() {
    return this.#chunkPosition.getY();
  }

  isLoaded() {
    return this.#loaded;
  }

  addEntity(entity) {
    this.#entities.set(entity.getId(), entity);
  }

  removeEntity(id) {
    this.#entities.delete(id);
  }

  getEntity(id) {
    return this.#entities.get(id);
  }

  getBlocks() {
    return this.#blocks;
  }

  getBlock(x, y) {
    return this.#blocks[y][x];
  }

  getSaveData() {
    let block;
    let blockName = "";
    let index = 0;
    let saveString = "";
    var y;
    var x;
    for (y = 0; y < 16; y++) {
      for (x = 0; x < 16; x++) {
        block = this.#blocks[y][x];
        if (blockName == "") blockName = block.getBlockClass();
        if (blockName == block.getBlockClass()) {
          index++;
        } else {
          saveString += `${blockName}-${index},`;
          blockName = block.getBlockClass();
          index = 1;
        }

      }
    }

    if (blockName != "" && index != 0) saveString += `${blockName}-${index},`;

    return saveString;

  }

  getWorldObjectData() {
    let saveString = "";
    let block;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        block = this.getBlock(x, y);
        if (block.getWorldObject() == null) continue;
        saveString += `${block.getWorldObject()}_${block.getBlockX()}_${block.getBlockY()},`;
      }
    }

    return saveString;

  }

}

module.exports = Chunk;
