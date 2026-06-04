import { routes } from './app.routes';

describe('app.routes', () => {
  it('should tener ruta /categorias como hija del layout', () => {
    const layout = routes[0];
    const children = layout.children ?? [];
    expect(children.some(r => r.path === 'categorias')).toBe(true);
  });

  it('should tener ruta /movimientos como hija del layout', () => {
    const layout = routes[0];
    const children = layout.children ?? [];
    expect(children.some(r => r.path === 'movimientos')).toBe(true);
  });
});
