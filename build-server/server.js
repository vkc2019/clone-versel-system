const redis = require('redis');
const fs = require('fs');
const { exec } = require('child_process')

const REDIS_URL = process.env.REDIS_URL;

const DEPLOY_PATH = process.env.DEPLOY_PATH;

async function buildSystem(id) {

    return new Promise((resolve) => {
        const child = exec(`cd data/${id} && npm install && npm run build`);

        child.stdout.on('data', (data) => {
            console.log(`buildSystem log:${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`buildSystem error:${data}`);
        });
        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
            resolve('');
        });

    })

}

async function deployApplication(id) {
    fs.cpSync(`data\\${id}\\build`,
        `${DEPLOY_PATH}\\${id}`, {
        recursive: true,
    })
    console.log(`deployement completed`)
}

async function cloneProject(id, url) {
    return new Promise(resolve => {
        const child = exec(`cd data && git clone ${url} ${id}`);

        child.stdout.on('data', (data) => {
            console.log(`buildSystem log:${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`buildSystem error : ${data}`);
        });

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
            resolve("")

        });
    })

}

(async () => {

    const client = redis.createClient({
        url: REDIS_URL
    });

    const publisher = redis.createClient({
        url: REDIS_URL
    })

    await publisher.connect();

    client.on('error', err => console.log('Redis Client Error', err));

    client.on("connect", () => {
        console.log(`build server connected`)
    });

    await client.connect();

    await client.subscribe('build-engine', async (message) => {
        const msg = JSON.parse(message);
        console.log(msg.slug)
        await cloneProject(msg.slug, msg.url)
        await publisher.set(msg.slug, "clone-completed", redis.print);
        await buildSystem(msg.slug);
        await publisher.set(msg.slug, "build-completed", redis.print);
        await deployApplication(msg.slug);
        await publisher.set(msg.slug, "deployed", redis.print);
    });
    client.subscribe("pubsub");
})();

