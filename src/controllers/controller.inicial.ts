import { Request, Response } from "express";
import { Utils } from "../utils/utils";

import { ModelInicial } from "../models/model.inicial";

export class ControllerInicial {
  private utils: Utils;
  private modelInicial: ModelInicial;

    constructor() {
    this.utils = new Utils();
    this.modelInicial = new ModelInicial();
  }
  controllerInicial = async (req: Request, res: Response) => {
    try {

      const resultado = await this.modelInicial.modelInicio();

      if (!resultado.estado) {
        return res.status(400).json({
          estado: false,
          mensaje: "Error al consultar datos",
          datos: resultado.datos
        });
      }

      return res.status(200).json({
        estado: true,
        mensaje: resultado.mensaje,
        datos: resultado.datos
      });

    } catch (error) {
      return res.status(500).json({
        estado: false,
        mensaje: "Error inesperado",
        datos: error
      });
    }
  };
}