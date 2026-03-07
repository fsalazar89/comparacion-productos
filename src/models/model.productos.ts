import { Utils } from "../utils/utils";
import pool from "../config/db/db.challenge";
import { IParametros } from '../interfaces/interface';

export class ModelProductos {
  private utils: Utils;

  constructor() {
    this.utils = new Utils();
  }

  private _prepararCamposQuery = (camposQuery?: string) => {
    const columnasPermitidas = ['id', 'nombre', 'descripcion', 'precio', 'marca', 'url_imagen', 'especificaciones'];

    let seleccion = columnasPermitidas.join(', ');
    if (camposQuery) {
      const solicitados = camposQuery.replace(/\s+/g, '').split(',');
      const validados = solicitados.filter(c => columnasPermitidas.includes(c));
      if (validados.length > 0) seleccion = validados.join(', ');
    }
    return seleccion;
  }

  public modelListarProductos = async (camposQuery?: string) => {
    let clienteDb;
    try {
      clienteDb = await pool.connect();
      let seleccion = this._prepararCamposQuery(camposQuery);
      const sql = `SELECT ${seleccion} FROM productos`;
      const resultado = await pool.query(sql);

      return { estado: true, datos: resultado.rows };
    } catch (error) {
      return { estado: false, mensaje: "Error al listar productos", datos: error };
    } finally {
      if (clienteDb) { clienteDb.release() };
    }
  };

  public modelDetalleProductoPorId = async (id: string) => {
    let clienteDb;
    try {
      if (isNaN(Number(id))) throw new Error("ID no válido");

      clienteDb = await pool.connect();
      // Aquí traemos el "*" o todos los campos detallados
      const sql = `SELECT * FROM productos WHERE id = $1`;
      const resultado = await pool.query(sql, [id]);

      if (resultado.rows.length === 0) {
        return { estado: false, mensaje: "Producto no encontrado", status: 404 };
      }

      return { estado: true, datos: resultado.rows[0] };
    } catch (error: any) {
      return { estado: false, mensaje: error.message, status: 400 };
    } finally {
      if (clienteDb) clienteDb.release();
    }
  };

  public modelCompararProductos = async (ids: string, camposQuery?: string) => {
    let clienteDb;
    try {
      clienteDb = await pool.connect();
      let seleccion = this._prepararCamposQuery(camposQuery);

      const listaIds = ids.split(',').filter(id => !isNaN(Number(id)));
      if (listaIds.length === 0) return { estado: false, mensaje: "No se enviaron lista IDs validos" };

      const placeholders = listaIds.map((_, i) => `$${i + 1}`).join(', ');
      const sql = `SELECT ${seleccion} FROM productos WHERE id IN (${placeholders})`;

      const resultado = await pool.query(sql, listaIds);

      return {
        estado: true,
        mensaje: listaIds.length !== ids.split(',').length ? "Algunos IDs eran invalidos" : "Consulta Exitosa",
        datos: resultado.rows
      };
    } catch (error) {
      return { estado: false, mensaje: "", datos: error };
    } finally {
      if (clienteDb) { clienteDb.release() };
    }
  };

}