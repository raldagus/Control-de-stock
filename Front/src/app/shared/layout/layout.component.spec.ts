import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
  });

  it('renderiza el encabezado STOCK', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('STOCK');
    expect(el.textContent).toContain('Control de inventario');
  });

  it('contiene los 4 links de navegación', () => {
    const links = fixture.nativeElement.querySelectorAll('a[routerLink]');
    expect(links.length).toBe(4);
  });
});
