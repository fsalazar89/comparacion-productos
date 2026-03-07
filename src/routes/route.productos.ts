import { Router } from 'express';
import { ModelLimiter } from '../config/config.limits';
import { ControllerProductos } from '../controllers/controller.productos';

export class RouterProductos {
    public router: Router;
    private limiter: ModelLimiter;
    private controllerProductos: ControllerProductos;
    private base = 'productos'

    constructor() {
        this.router = Router();
        this.limiter = new ModelLimiter();
        this.controllerProductos = new ControllerProductos();
        this.inicializarRutas();
    }

    private inicializarRutas() {
        this.router.get(`/${this.base}`,
            this.limiter.limiteSolicitudes(10, 1),
            this.controllerProductos.controllerListarProductos.bind(this.controllerProductos)
        );

        this.router.get(`/${this.base}/comparar`,
            this.limiter.limiteSolicitudes(10, 1),
            this.controllerProductos.controllerCompararProductos.bind(this.controllerProductos)
        );

        this.router.get(`/${this.base}/:id`,
            this.limiter.limiteSolicitudes(10, 1),
            this.controllerProductos.controllerDetalleProductoPorId.bind(this.controllerProductos)
        );
    }
}
