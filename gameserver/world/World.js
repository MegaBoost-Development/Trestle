const FS = require("fs");
const Chunk = require("./Chunk.js");
const ChunkPosition = require("./ChunkPosition.js");
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

class World {

  #name;
  #seed;
  #chunks;
  #noise2d;

  constructor(name, seed) {
    this.#name = name;
    this.#seed = seed;
    this.#chunks = new Map();
    this.#noise2d = createNoise2D(alea(seed));
  }

  generate() {

    let minSizeX = 2;
    let minSizeY = 2;

    let chunkPosition;
    for (let y = Math.floor(-minSizeY/2); y < Math.floor(minSizeY/2); y++) {
      for (let x = Math.floor(-minSizeX/2); y < Math.floor(minSizeX/2); y++) {
        chunkPosition = new ChunkPosition(x, y, this);
        this.#chunks.set(chunkPosition, new Chunk(chunkPosition));
      }
    }


  }

  save() {
    FS.writeFile(`../../worlds/${this.getName()}/world.mbwdf`, `${this.getName()},${this.getSeed()}`, function (err) {
      if (err) throw err;
    });

    //TODO: Chunk Data
  }

  getName() {
    return this.#name;
  }

  getSeed() {
    return this.#seed;
  }

  getNoise2D() {
    return this.#noise2d;
  }

  static loadOrGenerateNew(gameServer, fileName) {
    gameServer.log(`[WORLD] Starting to load: ${fileName}`);
    //parse world data from file system
    FS.readdir(`../../worlds/${fileName}`, (e, files) => {
      if (e) return gameServer.log(`Error whilst reading listener dir: ${e}`);
      if (!files) {
        let seed = Math.floor(Math.random() * 10000);
        gameServer.log(`[WORLD] ${fileName} not found. Generating with seed: ${seed}`);
        let world = new World(fileName, seed);
        world.generate();
        gameServer.log(`[WORLD] Generation complete.`);
        gameServer.log(`[WORLD] Saving current state of: ${name}`);
        world.save();
        gameServer.addWorld(world);
        return;
      }

      files.forEach((file) => {
        if (!file.endsWith(".mbwdf")) return;

        FS.readFile(`../../worlds/${fileName}/world.`, (err, data) => {
          if (err) throw err;

          let worldData = data.split(",");
          let world = new World(worldData[0], Number(worldData[1]));

        })
      });

    });
  }

}

module.exports = World;
