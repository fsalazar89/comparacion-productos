import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const CAMPOS_PERMITIDOS = [
  'id',
  'nombre',
  'descripcion',
  'precio',
  'valoracion',
  'tamano',
  'peso',
  'color',
  'url_imagen',
  'tipo',
  'marca',
  'modelo_version',
  'sistema_operativo',
  'bateria',
  'camara',
  'memoria',
  'almacenamiento'
];

const normalizarCampos = (value: string, helpers: Joi.CustomHelpers) => {
  const campos = value.split(',').map((campo) => campo.trim()).filter(Boolean);
  if (campos.length === 0) return helpers.error('any.invalid');

  const invalidos = campos.filter((campo) => !CAMPOS_PERMITIDOS.includes(campo));
  if (invalidos.length > 0) {
    return helpers.error('any.invalid', { invalidFields: invalidos });
  }

  return [...new Set(campos)].join(',');
};

const normalizarIds = (value: string, helpers: Joi.CustomHelpers) => {
  const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length < 2) return helpers.error('array.min');

  const invalidos = ids.filter((id) => !/^\d+$/.test(id));
  if (invalidos.length > 0) {
    return helpers.error('any.invalid', { invalidIds: invalidos });
  }

  return ids.join(',');
};

const schemaCamposOpcional = Joi.object({
  campos: Joi.string().trim().custom(normalizarCampos, 'normalizacion de campos').optional()
}).unknown(true);

const schemaIdParam = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required()
}).required();

const schemaComparar = Joi.object({
  ids: Joi.string().trim().required().custom(normalizarIds, 'normalizacion de ids'),
  campos: Joi.string().trim().custom(normalizarCampos, 'normalizacion de campos').optional()
}).unknown(true);

const responderError = (res: Response, status: number, mensaje: string, detalle?: unknown) => {
  return res.status(status).json({
    estado: false,
    mensaje,
    ...(detalle ? { datos: detalle } : {})
  });
};

export class ValidacionCampos {
  public validarCamposOpcional = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schemaCamposOpcional.validate(req.query, { abortEarly: true });
    if (!error) {
      res.locals.queryValidada = {
        ...res.locals.queryValidada,
        campos: value.campos,
      };
      return next();
    }

    return responderError(res, 422, "El parametro 'campos' contiene atributos no permitidos", error.details[0]?.context);
  };

  public validarIdRuta = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schemaIdParam.validate(req.params, { abortEarly: true });
    if (!error) return next();

    return responderError(res, 400, "El parametro 'id' debe ser un entero positivo");
  };

  public validarComparacion = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schemaComparar.validate(req.query, { abortEarly: true });
    if (!error) {
      res.locals.queryValidada = {
        ...res.locals.queryValidada,
        ids: value.ids,
        campos: value.campos,
      };
      return next();
    }

    const type = error.details[0]?.type;
    if (type === 'any.required' || type === 'string.empty') {
      return responderError(res, 400, "El parametro 'ids' es obligatorio");
    }

    if (type === 'array.min') {
      return responderError(res, 422, "El parametro 'ids' debe incluir al menos 2 IDs");
    }

    const ctx = error.details[0]?.context;
    if (ctx?.invalidIds) {
      return responderError(res, 422, "El parametro 'ids' contiene valores invalidos", { invalidIds: ctx.invalidIds });
    }

    if (ctx?.invalidFields) {
      return responderError(res, 422, "El parametro 'campos' contiene atributos no permitidos", { invalidFields: ctx.invalidFields, allowedFields: CAMPOS_PERMITIDOS });
    }

    return responderError(res, 422, 'Parametros de comparacion invalidos');
  };
}
