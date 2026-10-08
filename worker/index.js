import keys from "./keys.js";
import redis from "redis";

// setting up a redis client importing host and port from keys file
const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000,
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const sub = redisClient.duplicate();

sub.on('error', (err) => console.error('Redis Subscriber Error', err));

await redisClient.connect();
await sub.connect();

// actual function that returns the result from index
const fib = (index) => {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

await sub.subscribe('insert', async (message) => {
    await redisClient.hSet('values', message, fib(parseInt(message)).toString());
});