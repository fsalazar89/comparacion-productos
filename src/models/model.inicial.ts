import { Utils } from "../utils/utils";

export class ModelInicial {
  private utils: Utils;

  constructor() {
    this.utils = new Utils();
  }

  modelInicio = async () => {
    return { estado: true, mensaje: "API - Consulta y comparacion de productos", datos: null };
  }

}