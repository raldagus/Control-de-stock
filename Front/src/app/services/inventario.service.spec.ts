import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventarioService } from './inventario.service';
import { CategoriaCrear } from '../models/categoria.model';
import { Producto, ProductoEditar } from '../models/producto.model';

describe('InventarioService', () => {
  let servicio: InventarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(InventarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getDashboard() calcula los KPIs correctamente', () => {
    const categoriasMock = [
      { idCategoria: 1, nombre: 'Electrónica' },
      { idCategoria: 2, nombre: 'Ropa' },
    ];
    const productosMock = [
      { idProducto: 1, nombre: 'TV', precioUnitario: 1000, stock: 10, idCategoria: 1, nombreCategoria: 'Electrónica' },
      { idProducto: 2, nombre: 'Camisa', precioUnitario: 50, stock: 3, idCategoria: 2, nombreCategoria: 'Ropa' },
    ];

    let resultado: any;
    servicio.getDashboard().subscribe(data => (resultado = data));

    httpMock.expectOne('https://localhost:7123/api/categorias').flush(categoriasMock);
    httpMock.expectOne('https://localhost:7123/api/productos').flush(productosMock);

    expect(resultado.totalCategorias).toBe(2);
    expect(resultado.totalProductos).toBe(2);
    expect(resultado.valorInventario).toBe(10150); // 1000*10 + 50*3
    expect(resultado.productosStockBajo).toEqual([productosMock[1]]); // stock 3 < 5
  });

  it('getDashboard() retorna array vacío de productosStockBajo si todos tienen stock >= 5', () => {
    const productosMock = [
      { idProducto: 1, nombre: 'TV', precioUnitario: 1000, stock: 10, idCategoria: 1, nombreCategoria: 'Electrónica' },
    ];

    let resultado: any;
    servicio.getDashboard().subscribe(data => (resultado = data));

    httpMock.expectOne('https://localhost:7123/api/categorias').flush([]);
    httpMock.expectOne('https://localhost:7123/api/productos').flush(productosMock);

    expect(resultado.productosStockBajo).toEqual([]);
  });

  it('crearCategoria hace POST a /api/categorias y retorna la categoría creada', () => {
    const payload = { nombre: 'Electrónica', descripcion: 'Descripción' };
    const respuesta = { idCategoria: 1, nombre: 'Electrónica', descripcion: 'Descripción' };

    let resultado: any;
    servicio.crearCategoria(payload).subscribe(cat => (resultado = cat));

    const req = httpMock.expectOne('https://localhost:7123/api/categorias');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(respuesta);

    expect(resultado).toEqual(respuesta);
  });

  it('editarProducto hace PUT a /api/productos/{id} con el body correcto', () => {
    const payload: ProductoEditar = {
      idCategoria: 1,
      nombre: 'TV 55"',
      descripcion: 'TV 4K',
      codigo: 'TV001',
      precioUnitario: 1200,
    };
    const respuesta: Producto = {
      idProducto: 1,
      nombre: 'TV 55"',
      descripcion: 'TV 4K',
      codigo: 'TV001',
      precioUnitario: 1200,
      stock: 10,
      idCategoria: 1,
      nombreCategoria: 'Electrónica',
    };

    let resultado: any;
    servicio.editarProducto(1, payload).subscribe(p => (resultado = p));

    const req = httpMock.expectOne('https://localhost:7123/api/productos/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(respuesta);

    expect(resultado).toEqual(respuesta);
  });
});
