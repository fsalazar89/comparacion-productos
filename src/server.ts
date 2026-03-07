import './config/config.environments';
import { app } from './app';
import { getHttpsCredentials } from './config/https.config';
import http from 'http';
import https from 'https';

const port = process.env.APP_PORT;
const protocol = process.argv.includes('--local') ? 'http' : 'https';

const startServer = async () => {

    const server =
        protocol === 'http'
            ? http.createServer(app)
            : https.createServer(getHttpsCredentials(), app);

    server.listen(port, () => {
        console.log(`Ambiente: ${process.env.AMBIENTE_APP}`);
        console.log(`Servidor en ${protocol}://${process.env.DOMINIO}:${port}/api/v1`);
    });

};

startServer();
