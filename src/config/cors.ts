import { CorsOptions } from 'cors';

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

export const corsOptions: CorsOptions = {
    origin(origin: any, callback: any) {
        // Permitir requests server-to-server o tools (Postman, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error(`Origen no permitido por CORS: ${origin}`)
        );
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
