# Dashboard de Inicio — Plan de Implementación

> **Para workers agénticos:** SUB-SKILL REQUERIDO: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis checkbox (`- [ ]`) para seguimiento.

**Goal:** Construir el layout con sidebar y la página de inicio (Dashboard) del sistema de control de inventario, conectado a `https://localhost:7123/api`.

**Architecture:** `LayoutComponent` actúa como shell con sidebar y `<router-outlet>`. `DashboardComponent` es la ruta hija por defecto. `InventarioService` consume `GET /api/categorias` y `GET /api/productos` en paralelo con `forkJoin` para calcular los KPIs.

**Tech Stack:** Angular 21 (standalone, signals, nueva sintaxis de control flow), Tailwind CSS v4, RxJS forkJoin, HttpClient, Vitest + Angular TestBed.

---

## Mapa de archivos

| Acción   | Ruta                                                  | Responsabilidad                          |
|----------|-------------------------------------------------------|------------------------------------------|
| Modificar | `src/app/app.config.ts`                              | Agregar `provideHttpClient()`            |
| Modificar | `src/app/app.ts`                                     | Limpiar title signal                     |
| Modificar | `src/app/app.html`                                   | Solo `<router-outlet />`                 |
| Modificar | `src/app/app.routes.ts`                              | Rutas: Layout + Dashboard hijo           |
| Crear    | `src/app/services/inventario.service.ts`              | Llamadas API + cálculo de KPIs           |
| Crear    | `src/app/services/inventario.service.spec.ts`         | Tests del servicio                       |
| Crear    | `src/app/shared/layout/layout.component.ts`           | Shell con sidebar y router-outlet        |
| Crear    | `src/app/shared/layout/layout.component.html`         | Template del sidebar                     |
| Crear    | `src/app/shared/layout/layout.component.css`          | Estilos del layout                       |
| Crear    | `src/app/shared/layout/layout.component.spec.ts`      | Test de renderizado del sidebar          |
| Crear    | `src/app/pages/dashboard/dashboard.component.ts`      | Lógica del dashboard (signals)           |
| Crear    | `src/app/pages/dashboard/dashboard.component.html`    | Template KPIs + stock bajo               |
| Crear    | `src/app/pages/dashboard/dashboard.component.css`     | Estilos del dashboard                    |
| Crear    | `src/app/pages/dashboard/dashboard.component.spec.ts` | Tests del componente                     |

---

## Tarea 1: Preparar el shell de la app

**Archivos:**
- Modificar: `src/app/app.config.ts`
- Modificar: `src/app/app.ts`
- Modificar: `src/app/app.html`

- [ ] **Paso 1: Actualizar app.config.ts**

Reemplazar el contenido completo de `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

- [ ] **Paso 2: Limpiar app.ts**

Reemplazar el contenido completo de `src/app/app.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

- [ ] **Paso 3: Limpiar app.html**

Reemplazar el contenido completo de `src/app/app.html`:

```html
<router-outlet />
```

- [ ] **Paso 4: Actualizar app.spec.ts para que pase con el nuevo App**

Reemplazar el contenido completo de `src/app/app.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('crea el componente', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

- [ ] **Paso 5: Ejecutar tests para verificar que pasan**

```bash
npx ng test --include="**/app.spec.ts"
```

Resultado esperado: `1 test passed`

- [ ] **Paso 6: Commit**

```bash
git add src/app/app.config.ts src/app/app.ts src/app/app.html src/app/app.spec.ts
git commit -m "feat: configurar HttpClient y limpiar shell de la app"
```

---

## Tarea 2: InventarioService (TDD)

**Archivos:**
- Crear: `src/app/services/inventario.service.spec.ts`
- Crear: `src/app/services/inventario.service.ts`

- [ ] **Paso 1: Escribir el test que falla**

Crear `src/app/services/inventario.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventarioService } from './inventario.service';

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
});
```

- [ ] **Paso 2: Verificar que el test falla**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Resultado esperado: error de importación o "Cannot find module"

- [ ] **Paso 3: Implementar el servicio**

Crear `src/app/services/inventario.service.ts`:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';

export interface DashboardData {
  totalCategorias: number;
  totalProductos: number;
  valorInventario: number;
  productosStockBajo: Producto[];
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7123/api';

  getDashboard() {
    return forkJoin({
      categorias: this.http.get<Categoria[]>(`${this.baseUrl}/categorias`),
      productos: this.http.get<Producto[]>(`${this.baseUrl}/productos`),
    }).pipe(
      map(({ categorias, productos }) => ({
        totalCategorias: categorias.length,
        totalProductos: productos.length,
        valorInventario: productos.reduce((acc, p) => acc + p.precioUnitario * p.stock, 0),
        productosStockBajo: productos.filter(p => p.stock < 5),
      }))
    );
  }
}
```

- [ ] **Paso 4: Verificar que los tests pasan**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Resultado esperado: `2 tests passed`

- [ ] **Paso 5: Commit**

```bash
git add src/app/services/inventario.service.ts src/app/services/inventario.service.spec.ts
git commit -m "feat: agregar InventarioService con cálculo de KPIs"
```

---

## Tarea 3: LayoutComponent (TDD)

**Archivos:**
- Crear: `src/app/shared/layout/layout.component.spec.ts`
- Crear: `src/app/shared/layout/layout.component.ts`
- Crear: `src/app/shared/layout/layout.component.html`
- Crear: `src/app/shared/layout/layout.component.css`

- [ ] **Paso 1: Escribir el test que falla**

Crear `src/app/shared/layout/layout.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
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
```

- [ ] **Paso 2: Verificar que el test falla**

```bash
npx ng test --include="**/layout.component.spec.ts"
```

Resultado esperado: error de importación

- [ ] **Paso 3: Crear layout.component.ts**

Crear `src/app/shared/layout/layout.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
```

- [ ] **Paso 4: Crear layout.component.html**

Crear `src/app/shared/layout/layout.component.html`:

```html
<div class="flex h-screen">
  <aside class="w-52 bg-[#1e2330] flex flex-col shrink-0">
    <div class="px-4 py-5 border-b border-gray-700">
      <p class="text-white font-bold text-sm tracking-widest">STOCK</p>
      <p class="text-gray-400 text-xs mt-0.5">Control de inventario</p>
    </div>

    <nav class="flex-1 px-2 py-3 space-y-1">
      <a
        routerLink="/"
        routerLinkActive="bg-indigo-600 text-white"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:bg-gray-700 text-sm transition-colors"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </a>

      <a
        routerLink="/categorias"
        routerLinkActive="bg-indigo-600 text-white"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:bg-gray-700 text-sm transition-colors"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Categorías
      </a>

      <a
        routerLink="/productos"
        routerLinkActive="bg-indigo-600 text-white"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:bg-gray-700 text-sm transition-colors"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Productos
      </a>

      <a
        routerLink="/movimientos"
        routerLinkActive="bg-indigo-600 text-white"
        class="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:bg-gray-700 text-sm transition-colors"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Movimientos
      </a>
    </nav>
  </aside>

  <main class="flex-1 bg-gray-50 overflow-auto">
    <router-outlet />
  </main>
</div>
```

- [ ] **Paso 5: Crear layout.component.css (vacío)**

Crear `src/app/shared/layout/layout.component.css`:

```css
```

- [ ] **Paso 6: Verificar que los tests pasan**

```bash
npx ng test --include="**/layout.component.spec.ts"
```

Resultado esperado: `2 tests passed`

- [ ] **Paso 7: Commit**

```bash
git add src/app/shared/layout/
git commit -m "feat: agregar LayoutComponent con sidebar de navegación"
```

---

## Tarea 4: DashboardComponent (TDD)

**Archivos:**
- Crear: `src/app/pages/dashboard/dashboard.component.spec.ts`
- Crear: `src/app/pages/dashboard/dashboard.component.ts`
- Crear: `src/app/pages/dashboard/dashboard.component.html`
- Crear: `src/app/pages/dashboard/dashboard.component.css`

- [ ] **Paso 1: Escribir el test que falla**

Crear `src/app/pages/dashboard/dashboard.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { InventarioService } from '../../services/inventario.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  describe('sin productos con stock bajo', () => {
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
      const mockServicio = {
        getDashboard: vi.fn().mockReturnValue(
          of({ totalCategorias: 3, totalProductos: 4, valorInventario: 13536.40, productosStockBajo: [] })
        ),
      };
      await TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [{ provide: InventarioService, useValue: mockServicio }],
      }).compileComponents();
      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
    });

    it('muestra las tarjetas KPI', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('3');
      expect(el.textContent).toContain('4');
    });

    it('muestra estado vacío', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('No hay productos con stock bajo');
    });
  });

  describe('con productos de stock bajo', () => {
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
      const mockServicio = {
        getDashboard: vi.fn().mockReturnValue(
          of({
            totalCategorias: 1, totalProductos: 1, valorInventario: 20,
            productosStockBajo: [
              { idProducto: 5, nombre: 'Lapicera', precioUnitario: 10, stock: 2, idCategoria: 1, nombreCategoria: 'Oficina' },
            ],
          })
        ),
      };
      await TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [{ provide: InventarioService, useValue: mockServicio }],
      }).compileComponents();
      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
    });

    it('muestra el nombre del producto en la tabla', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('Lapicera');
      expect(el.textContent).toContain('Oficina');
    });
  });
});
```

- [ ] **Paso 2: Verificar que el test falla**

```bash
npx ng test --include="**/dashboard.component.spec.ts"
```

Resultado esperado: error de importación

- [ ] **Paso 3: Crear dashboard.component.ts**

Crear `src/app/pages/dashboard/dashboard.component.ts`:

```typescript
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly inventarioService = inject(InventarioService);

  totalCategorias = signal(0);
  totalProductos = signal(0);
  valorInventario = signal(0);
  productosStockBajo = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  valorInventarioFormateado = computed(() =>
    '$ ' + this.valorInventario().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );

  ngOnInit() {
    this.inventarioService.getDashboard().subscribe({
      next: (data) => {
        this.totalCategorias.set(data.totalCategorias);
        this.totalProductos.set(data.totalProductos);
        this.valorInventario.set(data.valorInventario);
        this.productosStockBajo.set(data.productosStockBajo);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los datos');
        this.cargando.set(false);
      },
    });
  }
}
```

- [ ] **Paso 4: Crear dashboard.component.html**

Crear `src/app/pages/dashboard/dashboard.component.html`:

```html
<div class="p-8">
  <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

  <div class="grid grid-cols-3 gap-4 mb-8">
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categorías</p>
      <p class="text-3xl font-bold text-gray-800">{{ totalCategorias() }}</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Productos</p>
      <p class="text-3xl font-bold text-gray-800">{{ totalProductos() }}</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Valor del Inventario</p>
      <p class="text-2xl font-bold text-indigo-600">{{ valorInventarioFormateado() }}</p>
    </div>
  </div>

  <div>
    <h2 class="text-lg font-semibold text-gray-800 mb-4">
      Productos con stock bajo
      <span class="text-sm font-normal text-gray-400 ml-1">(menos de 5 unidades)</span>
    </h2>

    @if (cargando()) {
      <div class="border border-gray-200 rounded-lg py-8 text-center text-gray-400 bg-white">
        Cargando...
      </div>
    } @else if (error()) {
      <div class="border border-red-200 rounded-lg py-8 text-center text-red-400 bg-white">
        {{ error() }}
      </div>
    } @else if (productosStockBajo().length === 0) {
      <div class="border border-gray-200 rounded-lg py-8 text-center text-gray-400 bg-white">
        No hay productos con stock bajo
      </div>
    } @else {
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody>
            @for (producto of productosStockBajo(); track producto.idProducto) {
              <tr class="border-b border-gray-100 last:border-0">
                <td class="px-6 py-3 text-gray-800">{{ producto.nombre }}</td>
                <td class="px-6 py-3 text-gray-500">{{ producto.nombreCategoria }}</td>
                <td class="px-6 py-3 font-semibold text-red-500">{{ producto.stock }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  </div>
</div>
```

- [ ] **Paso 5: Crear dashboard.component.css (vacío)**

Crear `src/app/pages/dashboard/dashboard.component.css`:

```css
```

- [ ] **Paso 6: Verificar que los tests pasan**

```bash
npx ng test --include="**/dashboard.component.spec.ts"
```

Resultado esperado: `3 tests passed`

- [ ] **Paso 7: Commit**

```bash
git add src/app/pages/dashboard/
git commit -m "feat: agregar DashboardComponent con KPIs y tabla de stock bajo"
```

---

## Tarea 5: Configurar rutas y verificar en el browser

**Archivos:**
- Modificar: `src/app/app.routes.ts`

- [ ] **Paso 1: Actualizar las rutas**

Reemplazar el contenido completo de `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
    ],
  },
];
```

- [ ] **Paso 2: Ejecutar todos los tests**

```bash
npm test
```

Resultado esperado: todos los tests pasan (mínimo 8 tests)

- [ ] **Paso 3: Iniciar el servidor de desarrollo**

```bash
npm start
```

Abrir `http://localhost:4200` en el navegador y verificar:
- El sidebar oscuro aparece a la izquierda con los 4 links
- El link "Dashboard" está activo (fondo indigo)
- Las 3 tarjetas KPI muestran los datos de la API
- La sección "Productos con stock bajo" muestra estado vacío o tabla según corresponda

> **Nota SSL:** La primera vez que la app haga requests a `https://localhost:7123`, el browser puede bloquearlos por certificado self-signed. Abrí directamente `https://localhost:7123/api/categorias` en una pestaña y aceptá el certificado. Luego recargá la app en `http://localhost:4200`.

- [ ] **Paso 4: Commit final**

```bash
git add src/app/app.routes.ts
git commit -m "feat: configurar rutas con LayoutComponent y DashboardComponent"
```
