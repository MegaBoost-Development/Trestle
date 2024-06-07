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

  let player = new Player(name, id, x, y, speed, height, width, gameServer.getWorld(world));
  gameServer.log(`${name}[${client.handshake.address}] connected with id ${id} at ([${world}]1,1)`);
  gameServer.getWorldMap().forEach((gameWorld, gameWorldName) => {
    client.emit("WorldSendEvent", gameWorldName, gameWorld.getSeed());
  });

  client.emit("PlayerSuccessfulConnection", id, 1, 1, world);
  client.broadcast.emit("PlayerAllowedConnection", name, id, x, y, world);
  gameServer.getPlayers().forEach((gamePlayer, gamePlayerId) => {
    client.emit("PlayerAllowedConnection", gamePlayer.getName(), gamePlayerId, gamePlayer.getLocation().getX(), gamePlayer.getLocation().getY(), gamePlayer.getLocation().getWorld().getName());
  });

  gameServer.addPlayer(player);
  ioServer.emit("PlayerSendChatMessage", "", `${name} has joined the game!`, 'y');

}
