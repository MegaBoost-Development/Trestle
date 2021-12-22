package org.trestle.position;

import org.trestle.world.Chunk;
import org.trestle.world.World;

public class Location {

    private int x,y;
    private World world;
    private Chunk chunk;

    public Location(int x, int y, World world) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.chunk = world.getChunkByWorldPosition(x, y);
    }

    public Location(int x, int y) {
        this.x = x;
        this.y = y;
        this.world = null;
    }

    public Location(int x, int y, Chunk chunk) {
        this.x = x;
        this.y = y;
        this.chunk = chunk;
        this.world = chunk.getWorld();
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getX() {
        return x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getY() {
        return y;
    }

    public void setWorld(World world) {
        this.world = world;
    }

    public World getWorld() {
        return world;
    }

    public Chunk getChunk() {
        return chunk;
    }

    public void setChunk(Chunk chunk) {
        this.chunk = chunk;
    }

    public boolean sameLocation(Location loc) {
        return loc.getX() == getX() && loc.getY() == getY();
    }

}
