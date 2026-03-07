import express from 'express';
import cors from 'cors';

import { configuracionesHelmet } from './config/helmet.config';
import { corsOptions } from './config/cors';
import { timeoutMiddleware } from './middlewares/timeout.middleware';
import { httpsRedirect } from './middlewares/httpsRedirect.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { RoutesConfigV1 } from './routes/routes.config';

export const app = express();

app.set('trust proxy', 1);


app.use(timeoutMiddleware);
configuracionesHelmet(app);
app.use(cors(corsOptions));
app.use(httpsRedirect);

app.use(express.json({ limit: '1mb', strict: true }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// app.use(requestResponse);

new RoutesConfigV1(app).rutasApi();

app.use(errorHandler);
