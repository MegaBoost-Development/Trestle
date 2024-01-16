// Entry point.
const LoadBalancer = require("./loadbalancer/LoadBalancer.js");
const instance = new LoadBalancer();
instance.start();

// Handling exceptions:
process.on('unhandledRejection', async(reason, p) => {
    await console.error(reason, 'Unhandled Rejection at Promise.', p);
});

process.on('uncaughtException', async(err) => {
     await console.error(err, 'Uncaught Exception thrown.');

     // pm2 automatically restarts the process so the bot shouldn't go offline.
     process.exit(1);
});
