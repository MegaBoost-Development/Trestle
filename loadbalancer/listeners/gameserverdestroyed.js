module.exports = async (loadBalancer, client, gameServer, packetData) => {

  //let gameServer = loadBalancer.getGameServerById(client.id);
  if (gameServer == null || gameServer == undefined) {
    loadBalancer.log(`Error! Invalid GameServer for id: ${client.id}`);
    return;
  }

  loadBalancer.log(`Disconnected from ${gameServer.getName()}`);
  loadBalancer.removeGameServer(client.id);

}
