const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.start();
    console.log(`[INFO] Server has running on ${server.info.uri}`);
}

init();