import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductosComponent } from './productos.component';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto.model';

const productosMock: Producto[] = [
  {
    idProducto: 1,
    nombre: 'TV 55"',
    descripcion: 'TV 4K',
    codigo: 'TV001',
    precioUnitario: 1200,
    stock: 10,
    idCategoria: 1,
    nombreCategoria: 'Electrónica',
  },
  {
    idProducto: 2,
    nombre: 'Camisa',
    descripcion: null,
    codigo: 'C001',
    precioUnitario: 50,
    stock: 30,
    idCategoria: 2,
    nombreCategoria: 'Ropa',
  },
];

const mockService = {
  getProductos: () => of(productosMock),
  editarProducto: () => of(productosMock[0]),
  getCategorias: () => of([]),
};

describe('ProductosComponent', () => {
  let fixture: ComponentFixture<ProductosComponent>;
  let component: ProductosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosComponent],
      providers: [{ provide: InventarioService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga 2 productos desde el servicio', () => {
    expect(component.productos().length).toBe(2);
  });

  it('mostrarModalEditar comienza en false', () => {
    expect(component.mostrarModalEditar()).toBe(false);
  });

  it('abrirEditar() setea productoSeleccionado y abre el modal', () => {
    component.abrirEditar(productosMock[0]);
    expect(component.productoSeleccionado()).toEqual(productosMock[0]);
    expect(component.mostrarModalEditar()).toBe(true);
  });

  it('onProductoEditado() cierra el modal y recarga productos', () => {
    component.mostrarModalEditar.set(true);
    component.onProductoEditado();
    expect(component.mostrarModalEditar()).toBe(false);
    expect(component.productos().length).toBe(2);
  });
});
