package org.trestle.world;

import org.trestle.position.Location;

public class World {

    private final Chunk[][] chunks;
    private final Chunk[] loadedChunks;
    private Location worldSpawn;

    public World(int worldSizeX, int worldSizeY, Location worldSpawn) {
        this.chunks = new Chunk[worldSizeY][worldSizeX];
        this.loadedChunks = new Chunk[] {};
        this.worldSpawn = worldSpawn;
    }

    public Chunk[][] getChunks() {
        return chunks;
    }

    public Chunk[] getLoadedChunks() {
        return loadedChunks;
    }

    public Chunk getChunkByWorldPosition(int worldX, int worldY) {
        int x = worldX / Chunk.CHUNK_WIDTH;
        int y = worldY / Chunk.CHUNK_HEIGHT;
        return getChunks()[y][x];
    }

    public Chunk getChunkByChunkPosition(int chunkX, int chunkY) {
        return getChunks()[chunkY][chunkX];
    }

    public Location getWorldSpawn() {
        return worldSpawn;
    }

    public void setWorldSpawn(Location worldSpawn) {
        this.worldSpawn = worldSpawn;
    }
}
