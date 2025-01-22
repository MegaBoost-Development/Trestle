const Player = require("../entity/Player.js");
const SETTINGS = require("../settings.json");

module.exports = async (ioServer, gameServer, client, packetData) => {
  const name = packetData.name[0];
  const id = client.id;
  const speed = packetData.speed[0];
  const height = packetData.height[0];
  const width = packetData.width[0];
  const worldName = SETTINGS.defaultWorldName;

  //assume we're just allowing default spawnX for now... data saving will come soon.
  let x = SETTINGS.defaultSpawnX;
  let y = SETTINGS.defaultSpawnY;

  //create the player on the server
  const player = new Player(name, id, x, y, speed, height, width, gameServer.getWorld(worldName));
  gameServer.log(`${name}[${client.handshake.address}] connected with id ${id} at ([${worldName}]${x},${y})`);

  //send the player basic world information for all worlds on the server.
  gameServer.getWorldMap().forEach((gameWorld, gameWorldName) => {
    client.emit("WorldSendEvent", gameWorldName, gameWorld.getSeed());
  });

  //send the player the initial chunk they'll spawn in...
  //the game will immediately request the surrounding chunks but this just ensures a FAST load into the world.
  const chunk = gameServer.getWorld(worldName).getChunkByBlockPosition(x, y);
  client.emit("AddChunk", chunk.getChunkX(), chunk.getChunkY(), worldName, chunk.getSaveData(), chunk.getWorldObjectData(), chunk.getBiomeData());

  //tell the player they're allowed to connect
  //this gives the player their network id
  client.emit("PlayerSuccessfulConnection", id, x, y, worldName);

  //tell the rest of the server this player connected
  client.broadcast.emit("PlayerAllowedConnection", name, id, x, y, worldName);

  //send existing players to the client
  gameServer.getPlayers().forEach((gamePlayer, gamePlayerId) => {
    client.emit("PlayerAllowedConnection", gamePlayer.getName(), gamePlayerId, gamePlayer.getLocation().getX(), gamePlayer.getLocation().getY(), gamePlayer.getLocation().getWorld().getName());
  });

  //add the player to the server after we update everyone to avoid accidentally sending the player a second copy of themself.
  gameServer.addPlayer(player);
  ioServer.emit("PlayerSendChatMessage", "", `${name} has joined the game!`, 'y');

}
