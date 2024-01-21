const Player = require("../entity/Player.js");
const CONFIG = require("../../config.json");

module.exports = async (gameServer, client, packetData) => {
  let name = packetData.name[0];
  let id = client.id;
  let x = packetData.x[0];
  let y = packetData.y[0];
  let speed = packetData.speed[0];
  let height = packetData.height[0];
  let width = packetData.width[0];
  let world = CONFIG.gameServer.defaultGameWorld;

  let player = new Player(name, id, x, y, speed, height, width, world)
  gameServer.addPlayer(player);
  gameServer.log(`${name} connected with id: ${client.id}.`);

}
