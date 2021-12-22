package org.trestle;

/**
 * Main Class and the class used to directly interface with the server.
 * @author Mark Viggiano
 */
public class Server {

    private static Server INSTANCE;
    private final int port;

    public Server() {
        INSTANCE = this;
        this.port = 2080;
    }

    /**
     * @return The port the server is running on
     */
    public int getPort() {
        return port;
    }

    /**
     * @return The instance of the server class.
     */
    public static Server getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) {
        System.out.println("Starting server...");
        new Server();
    }

}
