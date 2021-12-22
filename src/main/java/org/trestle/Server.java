package org.trestle;

import java.util.logging.Logger;

/**
 * Main Class and the class used to directly interface with the server.
 * @author Mark Viggiano
 */
public class Server {

    private static Server INSTANCE;
    private final int port;
    private final Logger logger;

    public Server() {
        INSTANCE = this;
        this.port = 2080;
        this.logger = Logger.getLogger("Server");

        start();
    }

    /**
     *
     */
    private void start() {
        getLogger().info("Starting server...");
    }

    public void stop() {
        getLogger().info("Stopping server...");
    }

    /**
     * @return The port the server is running on
     */
    public int getPort() {
        return port;
    }

    /**
     * @return The java logger for the server.
     */
    public Logger getLogger() {
        return logger;
    }

    /**
     * @return The instance of the server class.
     */
    public static Server getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) {
        new Server();
    }

}
