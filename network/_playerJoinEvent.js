const NetworkEvent = require("./_networkEvent.js");
const ConnectionStatus = require("./_connectionStatus.js");
const Player = require("../entity/_player.js");

class PlayerJoinEvent extends NetworkEvent {

  static execute(server, socket, data) {
    console.log(`${data.name} has joined!`);
    server.players.set(socket.id, new Player(data.x, data.y, data.name, data.width, data.height, data.speed));
    socket.emit("PlayerConnectionResponse", ConnectionStatus.GOOD, "testing")
  }

}

module.exports = PlayerJoinEvent;
