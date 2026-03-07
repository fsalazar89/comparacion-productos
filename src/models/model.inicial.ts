import { Utils } from "../utils/utils";

export class ModelInicial {
  private utils: Utils;

  constructor() {
    this.utils = new Utils();
  }

  modelInicio = async () => {
    return { estado: true, mensaje: "Modelo Inicial Activo", datos: null };
  }

}