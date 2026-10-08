import keys from "./keys.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";
import redis from "redis";

// setting the express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// setting the postgres client
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl:
        process.env.NODE_ENV !== 'production'
            ? false
            : { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

// setting up a redis client importing host and port from keys file
const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000,
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const redisPublisher = redisClient.duplicate();

await redisClient.connect();
await redisPublisher.connect();

// express route handlers

app.get("/", (req, res) => {
    res.send('Hi!');
})

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
})

app.get("/values/current", async (req, res) => {
    const values = await redisClient.hGetAll('values');
    res.send(values);
})

app.post("/values", async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    await redisClient.hSet('values', index.toString(), 'Nothing yet!');
    await redisPublisher.publish('insert', index.toString());

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
})

app.listen(5000, err => {
    console.log('listening..');
})