import { NextFunction, Request, Response } from 'express';
import { ServicioProductos } from '../services/service.productos';
import { IRespuesta } from '../interfaces/interface';

export class ControllerProductos {
    private servicioProductos: ServicioProductos;

    constructor() {
        this.servicioProductos = new ServicioProductos();
    }

    controllerListarProductos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const campos = res.locals.queryValidada?.campos ?? req.query.campos;
            const resultado: IRespuesta = await this.servicioProductos.serviceListarProductos(campos);
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };

    controllerDetalleProductoPorId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const campos = res.locals.queryValidada?.campos ?? req.query.campos;
            const resultado: IRespuesta = await this.servicioProductos.serviceDetalleProductoPorId(req.params.id, campos);
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };

    controllerCompararProductos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const ids = res.locals.queryValidada?.ids ?? req.query.ids;
            const campos = res.locals.queryValidada?.campos ?? req.query.campos;
            const resultado: IRespuesta = await this.servicioProductos.serviceCompararProductos({ ids, campos });
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };
}
