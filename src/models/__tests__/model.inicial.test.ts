import { ModelInicial } from '../model.inicial';

describe('ModelInicial', () => {
  it('modelInicio retorna estado esperado', async () => {
    const model = new ModelInicial();

    const result = await model.modelInicio();

    expect(result).toEqual({ estado: true, mensaje: 'Modelo Inicial Activo', datos: null });
  });
});
