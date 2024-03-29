const keys = require("./keys")

// Express App Setup
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
    connectionString: keys.pgURL
})
pgClient.on("error", () => console.log("Lost PG connection"));

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT PRIMARY KEY, value BIGINT)", (err, res) => {
    if (err) {
        console.error('Cannot create values', err);
    } else {
        console.log("Values table created");
    }
});

// redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
    url: keys.redisURL
});
const redisPublisher = redisClient.duplicate()

redisClient.connect().then(() => {
    console.log("redisClient: Connected to Redis");
});

redisPublisher.connect().then(() => {
    console.log("redisPublisher: Connected to Redis");
});

app.use('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    console.log("Request received", req.method, req.path);
});


app.get("*/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * from public.values");
    res.send(values.rows);
});

app.get("*/values/current", async (req, res) => {
    const values = await redisClient.hGetAll("values");
    res.send(values);
});

app.post("*/values", async (req, res) => {
    const index = req.body.index;
    await redisClient.hSet("values", index, `Waiting for computation`);
    await redisPublisher.publish("insert", index);
    try {
        await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
        res.send({ working: true });
    } catch (error) {
        res.send({ working: true });
    }
});

// app.use('/api', router);
app.use('/', (req, res) => {
    res.send("Yeh! You're at the root!");
});

app.listen(5000, err => { console.log("Listening"); });