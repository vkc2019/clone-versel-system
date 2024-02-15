const express = require('express');

const cors = require('cors');

const redis = require('redis');

const shortid = require('shortid');

const REDIS_URL = process.env.REDIS_URL;

const client = redis.createClient({
    url: REDIS_URL
})


const app = express();

app.use(cors());

app.use(express.json());

app.post('/', async (req, res) => {

    const slug = shortid.generate();

    const url = req.body.url;

    await client.connect();

    await client.publish('build-engine', JSON.stringify({
        slug,
        url
    }))

    await client.set(slug, "pending", redis.print);

    const respsonse = await client.get(slug, redis.print);

    await client.disconnect();

    res.status(200).json({
        url,
        slug,
        status: respsonse
    })
})

app.get('/:id', async (req, res) => {

    const id = req.params.id;

    await client.connect();

    const respsonse = await client.get(id, redis.print);
    await client.disconnect();
    res.json({
        status: respsonse
    })

})

const PORT = process.env.PORT || 9200;

app.listen(PORT, () => {
    console.log(`API Gateway is running on ${PORT}`)
})