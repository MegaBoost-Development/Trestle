const Command = require("../Command.js");

class TeleportCommand extends Command {
  constructor() {
    super("tp", "/tp <x> <y>", "Teleport to a location within the world.");

  }

  execute(ioServer, gameServer, client, args) {
    if (args.length < 2) {
      this.sendErrorMessage(client);
      return;
    }
    const player = gameServer.getPlayerById(client.id);
    let x = parseInt(args[0]);
    let y = parseInt(args[1]);
    let worldName = (args.length == 3) ? args[2] : player.getLocation().getWorld().getName();

    //set the player's location
    const playerLoc = player.getLocation();
    const world = gameServer.getWorld(worldName);
    playerLoc.setX(x * 50);
    playerLoc.setY(y * 50);
    playerLoc.setWorld(world);

    //send the player the chunk they're teleporting to incase they don't already have it.
    const chunk = world.getChunkByBlockPosition(x, y);
    client.emit("AddChunk", chunk.getChunkX(), chunk.getChunkY(), worldName, chunk.getSaveData(), chunk.getWorldObjectData());

    //teleport the player
    ioServer.emit("EntityTeleportEvent", client.id, x, y, worldName);
  }

}

module.exports = TeleportCommand
