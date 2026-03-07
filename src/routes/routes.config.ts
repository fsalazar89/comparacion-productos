import { Application } from "express";
import { RouterInicial } from "./route.init";

export class RoutesConfigV1 {
  private app: Application;
  private version = process.env.APP_VERSION || "";

  constructor(app: Application) { this.app = app; }
  
  public rutasApi = async () => {
    const initRoute = new RouterInicial();
    this.app.use(this.version, initRoute.router);
  };
}
