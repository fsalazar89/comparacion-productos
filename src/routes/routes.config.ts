import { Application } from "express";
import { RouterInicial } from "./route.init";
import { RouterProductos } from "./route.productos";
import { swaggerRouter } from "../config/swagger.config";

export class RoutesConfigV1 {
  private app: Application;
  private version = process.env.APP_VERSION || "";

  constructor(app: Application) { this.app = app; }
  
  public rutasApi = async () => {
    const initRoute = new RouterInicial();
    const routerProductos = new RouterProductos();

    this.app.use(this.version, swaggerRouter);
    this.app.use(this.version, initRoute.router);
    this.app.use(this.version, routerProductos.router);
  };
}
