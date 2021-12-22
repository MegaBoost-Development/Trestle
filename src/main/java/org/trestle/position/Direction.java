package org.trestle.position;

import java.util.HashMap;

public enum Direction {

    WEST("West", -1, 0),
    EAST("East", 1, 0),
    NORTH("North", 0, -1),
    SOUTH("South", 0, 1),
    NORTHWEST("North West", -1, -1),
    NORTHEAST("North East", 1, -1),
    SOUTHWEST("South West", -1, 1),
    SOUTHEAST("South East", 1, 1);

    private final String name;
    private final int xMultiplier;
    private final int yMultiplier;
    private static final HashMap<String, Direction> nameMap = new HashMap<>();

    Direction(String name, int xMultiplier, int yMultiplier) {
        this.name = name;
        this.xMultiplier = xMultiplier;
        this.yMultiplier = yMultiplier;
    }

    public String getName() {
        return name;
    }

    public int getXMultiplier() {
        return xMultiplier;
    }

    public int getYMultiplier() {
        return yMultiplier;
    }

    public static Direction getDirectionByName(String name) {
        return nameMap.getOrDefault(name.toLowerCase().replaceAll(" ", ""), null);
    }

    static {
        for (Direction direction : values()) {
            nameMap.put(direction.getName().toLowerCase().replaceAll(" ", ""), direction);
        }
    }

}
