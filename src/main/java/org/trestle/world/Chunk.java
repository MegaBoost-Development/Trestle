package org.trestle.world;

public class Chunk {

    private final int chunkX;
    private final int chunkY;
    private final int worldX;
    private final int worldY;
    private final World world;
    private final Block[][] blocks;
    public static int CHUNK_WIDTH = 800, CHUNK_HEIGHT = 800;

    public Chunk(int chunkX, int chunkY, World world) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.worldX = chunkX * 800;
        this.worldY = chunkY * 800;
        this.world = world;
        this.blocks = new Block[16][16];
    }

    public int getChunkX() {
        return chunkX;
    }

    public int getChunkY() {
        return chunkY;
    }

    public World getWorld() {
        return world;
    }

    public Block[][] getBlocks() {
        return blocks;
    }

    public int getWorldX() {
        return worldX;
    }

    public int getWorldY() {
        return worldY;
    }
}
