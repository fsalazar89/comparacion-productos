import moment from "moment-timezone";

const TZ = process.env.ZONA_HORARIA || "America/Bogota";

export class Utils {

  utilFechaHoraColombia = (fecha: Date | string = new Date()) => {
    return moment
      .tz(fecha, TZ)
      .format("YYYY-MM-DD HH:mm:ss");
  };

}