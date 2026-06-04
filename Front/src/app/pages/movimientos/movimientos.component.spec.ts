import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientosComponent } from './movimientos.component';

describe('MovimientosComponent', () => {
  let fixture: ComponentFixture<MovimientosComponent>;
  let component: MovimientosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mostrar título "Movimientos"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Movimientos');
  });

  it('should renderizar 5 filas en la tabla', () => {
    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas.length).toBe(5);
  });

  it('should mostrar badge Entrada con clase text-green-700', () => {
    const badges = fixture.nativeElement.querySelectorAll('.text-green-700');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should mostrar badge Salida con clase text-red-700', () => {
    const badges = fixture.nativeElement.querySelectorAll('.text-red-700');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should mostrar badge Ajuste con clase text-yellow-700', () => {
    const badges = fixture.nativeElement.querySelectorAll('.text-yellow-700');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should mostrar "—" cuando motivo está vacío', () => {
    const celdas = fixture.nativeElement.querySelectorAll('tbody tr td:last-child');
    const textos = Array.from(celdas).map((td: any) => td.textContent.trim());
    expect(textos).toContain('—');
  });
});
