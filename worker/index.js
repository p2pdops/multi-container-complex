const redis = require('redis');
const keys = require('./keys');
const client = redis.createClient({
    url: keys.redisURL,
});

const publisher = client.duplicate();

const { Pool } = require("pg");
const pgClient = new Pool({
    connectionString: keys.pgURL
})
pgClient.on("error", () => console.log("Lost PG connection"));


const fib = (index) => {
    if (index < 2) return '1';
    let a = '1';
    let b = '1';
    let c = '0';
    for (let i = 2; i <= index; i++) {
        c = (BigInt(a) + BigInt(b)).toString();
        a = b;
        b = c;
    }
    return c;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    await client.connect();
    await publisher.connect();
    console.log('redis:connected:successfully');
    client.subscribe('insert', async (message, channel) => {
        const index = message;
        console.log('Received message:', channel, index);
        await delay(2500);
        await publisher.hSet("values", index, `Worker is Processing`);
        const fibValue = fib(index);
        await delay(5000);
        console.log('Setting value:', index, fibValue);
        publisher.hSet('values', index, `Value is ${index} is ${fibValue}`);
        try {
            await pgClient.query(`
                INSERT INTO values(number,value)
                VALUES(${+index}, ${fibValue})
                ON CONFLICT (number)
                DO
                UPDATE SET value = ${fibValue}
                `);
        } catch (e) {
            console.error("Value aleardy exist");
        }
        console.log('Value set:', index, fibValue);
    });
})();