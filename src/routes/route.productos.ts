import { Router } from 'express';
import { ModelLimiter } from '../config/config.limits';
import { ControllerProductos } from '../controllers/controller.productos';
import { ValidacionCampos } from '../middlewares/validacion.campos';

export class RouterProductos {
    public router: Router;
    private limiter: ModelLimiter;
    private validacionCampos: ValidacionCampos;
    private controllerProductos: ControllerProductos;
    private base = 'productos'

    constructor() {
        this.router = Router();
        this.limiter = new ModelLimiter();
        this.validacionCampos = new ValidacionCampos();
        this.controllerProductos = new ControllerProductos();
        this.inicializarRutas();
    }

    private inicializarRutas() {
        this.router.get(`/${this.base}`,
            this.limiter.limiteSolicitudes(10, 1),
            this.validacionCampos.validarCamposOpcional,
            this.controllerProductos.controllerListarProductos.bind(this.controllerProductos)
        );

        this.router.get(`/${this.base}/comparar`,
            this.limiter.limiteSolicitudes(10, 1),
            this.validacionCampos.validarComparacion,
            this.controllerProductos.controllerCompararProductos.bind(this.controllerProductos)
        );

        this.router.get(`/${this.base}/:id`,
            this.limiter.limiteSolicitudes(10, 1),
            this.validacionCampos.validarIdRuta,
            this.validacionCampos.validarCamposOpcional,
            this.controllerProductos.controllerDetalleProductoPorId.bind(this.controllerProductos)
        );
    }
}
