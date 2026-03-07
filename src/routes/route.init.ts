// src/routes/InitRoute.ts
import { Router, Request, Response } from "express";
import { ModelLimiter } from "../config/config.limits";
import { ControllerInicial } from "../controllers/controller.inicial";

export class RouterInicial {
  public router: Router;
  private limiter: ModelLimiter;
  private controllerInicial: ControllerInicial;

  constructor() {
    this.router = Router();
    this.limiter = new ModelLimiter();
    this.controllerInicial = new ControllerInicial();
    this.initializarRoutas();
  }

  private initializarRoutas() {
    this.router.get(
      "/",
      this.limiter.limiteSolicitudes(5, 1),
      this.controllerInicial.controllerInicial.bind(this.controllerInicial)
    );
  }
}