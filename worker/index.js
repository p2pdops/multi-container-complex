const redis = require('redis');
const keys = require('./keys');
const client = redis.createClient({
    url: keys.redisURL,
});
const publisher = client.duplicate();

const fib = (index) => {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
};

(async () => {
    await client.connect();
    await publisher.connect();
    console.log('redis:connected:successfully');
    client.subscribe('insert', async (message, channel) => {
        console.log('Received message:', channel, message);
        await publisher.hSet('values', message, fib(message));
    });
})();