import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CategoriasComponent } from './categorias.component';
import { InventarioService } from '../../services/inventario.service';

const categoriasMock = [
  { idCategoria: 1, nombre: 'Electrónica', descripcion: 'Dispositivos' },
  { idCategoria: 2, nombre: 'Ropa', descripcion: 'Indumentaria' },
  { idCategoria: 3, nombre: 'Alimentos', descripcion: 'Comestibles' },
];

const mockService = {
  getCategorias: () => of(categoriasMock),
  crearCategoria: () => of({ idCategoria: 4, nombre: 'Nueva', descripcion: null }),
};

describe('CategoriasComponent', () => {
  let fixture: ComponentFixture<CategoriasComponent>;
  let component: CategoriasComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasComponent],
      providers: [{ provide: InventarioService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga 3 categorías desde el servicio', () => {
    expect(component.categorias().length).toBe(3);
  });

  it('muestra título "Categorías"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Categorías');
  });

  it('renderiza 3 filas en la tabla', () => {
    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas.length).toBe(3);
  });

  it('mostrarModal comienza en false', () => {
    expect(component.mostrarModal()).toBe(false);
  });

  it('click en "+ Nueva categoría" pone mostrarModal en true', () => {
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(component.mostrarModal()).toBe(true);
  });

  it('alCrearCategoria cierra el modal y recarga categorías', () => {
    component.mostrarModal.set(true);
    component.crearCategoria();
    expect(component.mostrarModal()).toBe(false);
    expect(component.categorias().length).toBe(3);
  });
});
