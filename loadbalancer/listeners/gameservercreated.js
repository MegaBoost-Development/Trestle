const GameServer = require("../GameServer.js");

module.exports = async (loadBalancer, client, gameServer, packetData) => {

  let id = client.id;
  let name = packetData.name;
  let port = packetData.port;

  loadBalancer.addGameServer(new GameServer(id, name, port));
  loadBalancer.log(`Connected to ${name}`);

}
