export interface IRespuesta {
    estado?: boolean;
    mensaje?: string;
    datos?: any;
    status?: number;
}

export interface IEspecificaciones {
  bateria: string;
  camara: string;
  os: string;
  color: string;
}

export interface IProducto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  url_imagen: string;
  especificaciones: IEspecificaciones;
}

export interface IParametros {
  id: string;
  ids: string;
  campos: string;
}