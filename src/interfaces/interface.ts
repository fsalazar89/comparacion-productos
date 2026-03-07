export interface IRespuesta {
    estado?: boolean;
    mensaje?: string;
    datos?: any;
    status?: number;
}

export interface IProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  valoracion?: number;
  tamano?: string;
  peso?: number;
  color?: string;
  url_imagen?: string;
  tipo?: string;
  marca?: string;
  modelo_version?: string;
  sistema_operativo?: string;
  bateria?: string;
  camara?: string;
  memoria?: string;
  almacenamiento?: string;
}

export interface IParametros {
  id: string;
  ids: string;
  campos: string;
}
