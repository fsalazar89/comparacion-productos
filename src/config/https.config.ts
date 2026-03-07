import fs from 'fs';
import path from 'path';

interface HttpsCredentials {
    key: string;
    cert: string;
}

export const getHttpsCredentials = (): HttpsCredentials => {
    const sslPath = process.env.CERTIFICATES_SSL_PATH;

    if (!sslPath) {
        throw new Error('CERTIFICATES_SSL_PATH no esta definido');
    }

    return {
        key: fs.readFileSync(path.join(sslPath, 'xxxxxxxxxx.key'), 'utf8'),
        cert: fs.readFileSync(path.join(sslPath, 'xxxxxxxxxx.crt'), 'utf8'),
    };
};
