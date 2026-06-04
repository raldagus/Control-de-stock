import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { EditarProductoModalComponent } from './editar-producto-modal.component';
import { InventarioService } from '../../../services/inventario.service';
import { Producto } from '../../../models/producto.model';

const productoMock: Producto = {
  idProducto: 1,
  nombre: 'TV 55"',
  descripcion: 'TV 4K',
  codigo: 'TV001',
  precioUnitario: 1200,
  stock: 10,
  idCategoria: 1,
  nombreCategoria: 'Electrónica',
};

const categoriasMock = [
  { idCategoria: 1, nombre: 'Electrónica', descripcion: null },
  { idCategoria: 2, nombre: 'Ropa', descripcion: null },
];

describe('EditarProductoModalComponent', () => {
  let fixture: ComponentFixture<EditarProductoModalComponent>;
  let component: EditarProductoModalComponent;
  let editarProductoSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    editarProductoSpy = vi.fn().mockReturnValue(of(productoMock));

    await TestBed.configureTestingModule({
      imports: [EditarProductoModalComponent],
      providers: [
        {
          provide: InventarioService,
          useValue: {
            editarProducto: editarProductoSpy,
            getCategorias: () => of(categoriasMock),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProductoModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productoInput', productoMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('puebla el formulario con los datos del producto recibido', () => {
    expect(component.nombre()).toBe('TV 55"');
    expect(component.descripcion()).toBe('TV 4K');
    expect(component.codigo()).toBe('TV001');
    expect(component.precioUnitario()).toBe(1200);
    expect(component.idCategoria()).toBe(1);
  });

  it('carga las categorías del servicio', () => {
    expect(component.categorias().length).toBe(2);
  });

  it('guardar() con nombre vacío activa errorNombre y no llama al servicio', () => {
    component.nombre.set('');
    component.guardar();
    expect(component.errorNombre()).toBe(true);
    expect(editarProductoSpy).not.toHaveBeenCalled();
  });

  it('guardar() con precio 0 activa errorPrecio y no llama al servicio', () => {
    component.precioUnitario.set(0);
    component.guardar();
    expect(component.errorPrecio()).toBe(true);
    expect(editarProductoSpy).not.toHaveBeenCalled();
  });

  it('guardar() llama al servicio con los datos correctos', () => {
    component.guardar();
    expect(editarProductoSpy).toHaveBeenCalledWith(1, {
      idCategoria: 1,
      nombre: 'TV 55"',
      descripcion: 'TV 4K',
      codigo: 'TV001',
      precioUnitario: 1200,
    });
  });

  it('guardar() exitoso emite productoEditado', () => {
    let emitido: Producto | undefined;
    component.productoEditado.subscribe(p => (emitido = p));
    component.guardar();
    expect(emitido).toEqual(productoMock);
  });

  it('guardar() exitoso resetea guardando a false', () => {
    component.guardar();
    expect(component.guardando()).toBe(false);
  });

  it('guardar() con error del servicio activa errorApi', () => {
    editarProductoSpy.mockReturnValue(throwError(() => new Error('error')));
    component.guardar();
    expect(component.errorApi()).toBe(true);
    expect(component.guardando()).toBe(false);
  });

  it('cancelar() emite cerrar', () => {
    let emitido = false;
    component.cerrar.subscribe(() => (emitido = true));
    component.cancelar();
    expect(emitido).toBe(true);
  });

  it('click en overlay emite cerrar', () => {
    let emitido = false;
    component.cerrar.subscribe(() => (emitido = true));
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]');
    overlay.click();
    expect(emitido).toBe(true);
  });

  it('botón Guardar está disabled mientras guardando() es true', () => {
    component.guardando.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('[data-testid="btn-guardar"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
