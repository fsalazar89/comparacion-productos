import rateLimit from "express-rate-limit";
import moment from 'moment-timezone';

export class ModelLimiter {
    private limirer: any = {
        standardHeaders: true, // Devuelve el limite de velocidad en los headers
        legacyHeaders: false, // Desactiva los headers de velocidad antiguos
        skipFailedRequests: true, // No cuenta las solicitudes fallidas
        skipSuccessfulRequests: false, // Cuenta las solicitudes exitosas
    };

    constructor() {}

    limiteSolicitudes = (solicitudes: any, timepo: any) => {

        this.limirer.windowMs = timepo * 60 * 1000;
        this.limirer.max = solicitudes;
        this.limirer.handler = (req: any, res: any) => {
            res.status(429).json({
                estado: false,
                mensaje: "Demasiadas solicitudes, intenta de nuevo más tarde",
                tiempo_reset: moment(req.rateLimit.resetTime).utc().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),
                datos: null,
            });
        };

        return rateLimit(this.limirer);

    }

}
