
import { ModelProductos } from '../models/model.productos';
import { IRespuesta } from '../interfaces/interface';

export class ServicioProductos {

    private modelProductos: ModelProductos;

    constructor() {
        this.modelProductos = new ModelProductos();
    }

    public serviceListarProductos = async (datos?: any) => {
        try {
            const listaProductos: IRespuesta = await this.modelProductos.modelListarProductos(datos);
            console.log(listaProductos);
            if (!listaProductos.estado) {
                const err: any = new Error(listaProductos.mensaje ?? 'Error interno al obtener los productos');
                err.status = listaProductos.status ?? 500;
                throw err;
            }

            return {
                estado: true,
                mensaje: listaProductos.mensaje ?? `Consulta Exitosa`,
                datos: listaProductos.datos,
            }
        } catch (error: any) {
            if (error.status) { throw error; }
            const err: any = new Error('Error interno al obtener los productos');
            err.status = 500;
            throw err;
        }
    }

    public serviceDetalleProductoPorId = async (datos?: any) => {
        try {
            const listaProductos: IRespuesta = await this.modelProductos.modelDetalleProductoPorId(datos);
            console.log(listaProductos);
            if (!listaProductos.estado) {
                const err: any = new Error(listaProductos.mensaje ?? 'Error interno al obtener los productos');
                err.status = listaProductos.status ?? 500;
                throw err;
            }

            return {
                estado: true,
                mensaje: listaProductos.mensaje ?? `Consulta Exitosa`,
                datos: listaProductos.datos,
            }
        } catch (error: any) {
            if (error.status) { throw error; }
            const err: any = new Error('Error interno al obtener los productos');
            err.status = 500;
            throw err;
        }
    }

    public serviceCompararProductos = async (datos?: any) => {
        try {
            const listaProductos: IRespuesta = await this.modelProductos.modelCompararProductos(datos.ids, datos.campos);
            console.log(listaProductos);
            if (!listaProductos.estado) {
                const err: any = new Error(listaProductos.mensaje ?? 'Error interno al obtener los productos');
                err.status = listaProductos.status ?? 500;
                throw err;
            }

            return {
                estado: true,
                mensaje: listaProductos.mensaje ?? `Consulta Exitosa`,
                datos: listaProductos.datos,
            }
        } catch (error: any) {
            if (error.status) { throw error; }
            const err: any = new Error('Error interno al obtener los productos');
            err.status = 500;
            throw err;
        }
    }
}
