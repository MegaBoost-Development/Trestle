const Player = require("../entity/Player.js");
const CONFIG = require("../../config.json");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let name = packetData.name[0];
  let id = client.id;
  let x = packetData.x[0];
  let y = packetData.y[0];
  let speed = packetData.speed[0];
  let height = packetData.height[0];
  let width = packetData.width[0];
  let world = CONFIG.gameServer.defaultWorldName;

  let player = new Player(name, id, x, y, speed, height, width, world)
  gameServer.addPlayer(player);
  gameServer.log(`${name} connected with id: ${id}.`);
  client.emit("PlayerId", id);
  gameServer.getWorldMap().forEach((gameWorld, gameWorldName) => {
    client.emit("WorldSendEvent", gameWorldName, gameWorld.getSeed());

    gameWorld.getChunkMap().forEach((chunk, chunkPosIdentity) => {
      client.emit("AddChunk", chunk.getChunkPosition().getX(), chunk.getChunkPosition().getY(), gameWorldName, chunk.getSaveData());
    });


  });

  client.emit("EntityTeleportEvent", id, 0, 0, world);


  client.broadcast.emit("PlayerAllowedConnection", name, id, x, y, world);
  ioServer.emit("PlayerSendChatMessage", "", `${name} has joined the game!`, 'y');

}
