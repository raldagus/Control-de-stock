# Vista Movimientos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la vista `/movimientos` con una tabla de solo lectura que lista movimientos de inventario con datos mockeados y badges de color por tipo.

**Architecture:** Standalone component `MovimientosComponent` con `signal<Movimiento[]>` mockeado, mismo patrón que `CategoriasComponent`. Sin servicios ni HTTP calls. Ruta hija de `LayoutComponent`.

**Tech Stack:** Angular 21 standalone, signals, Tailwind CSS v4, Vitest

---

## Archivos a crear/modificar

| Acción   | Archivo                                                              |
|----------|----------------------------------------------------------------------|
| Crear    | `src/app/pages/movimientos/movimientos.component.ts`                 |
| Crear    | `src/app/pages/movimientos/movimientos.component.html`               |
| Crear    | `src/app/pages/movimientos/movimientos.component.css`                |
| Crear    | `src/app/pages/movimientos/movimientos.component.spec.ts`            |
| Modificar| `src/app/app.routes.ts`                                              |
| Modificar| `src/app/app.routes.spec.ts`                                         |

---

## Task 1: MovimientosComponent con tabla y datos mockeados

**Files:**
- Create: `src/app/pages/movimientos/movimientos.component.ts`
- Create: `src/app/pages/movimientos/movimientos.component.html`
- Create: `src/app/pages/movimientos/movimientos.component.css`
- Create: `src/app/pages/movimientos/movimientos.component.spec.ts`

- [ ] **Step 1: Escribir el archivo de tests (fase roja)**

Crear `src/app/pages/movimientos/movimientos.component.spec.ts`:

```ts
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
});
```

- [ ] **Step 2: Correr los tests y verificar que fallen**

```bash
npx ng test --include="**/movimientos.component.spec.ts"
```

Resultado esperado: ERROR — `Cannot find module './movimientos.component'`

- [ ] **Step 3: Crear el archivo TypeScript del componente**

Crear `src/app/pages/movimientos/movimientos.component.ts`:

```ts
import { Component, signal } from '@angular/core';
import { Movimiento } from '../../models/movimiento.model';

@Component({
  selector: 'app-movimientos',
  imports: [],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css',
})
export class MovimientosComponent {
  readonly movimientos = signal<Movimiento[]>([
    {
      idMovimiento: 1,
      idProducto: 1,
      nombreProducto: 'Notebook Lenovo',
      tipoMovimiento: 'Entrada',
      cantidad: 10,
      precioUnitario: 850.0,
      motivo: 'Compra proveedor',
      fechaMovimiento: '2026-05-20',
    },
    {
      idMovimiento: 2,
      idProducto: 2,
      nombreProducto: 'Mouse Logitech',
      tipoMovimiento: 'Salida',
      cantidad: 3,
      precioUnitario: 25.0,
      motivo: 'Venta',
      fechaMovimiento: '2026-05-21',
    },
    {
      idMovimiento: 3,
      idProducto: 3,
      nombreProducto: 'Teclado Mecánico',
      tipoMovimiento: 'Ajuste',
      cantidad: -2,
      precioUnitario: 45.0,
      motivo: 'Corrección inventario',
      fechaMovimiento: '2026-05-22',
    },
    {
      idMovimiento: 4,
      idProducto: 1,
      nombreProducto: 'Notebook Lenovo',
      tipoMovimiento: 'Salida',
      cantidad: 2,
      precioUnitario: 850.0,
      fechaMovimiento: '2026-05-23',
    },
    {
      idMovimiento: 5,
      idProducto: 4,
      nombreProducto: 'Monitor Samsung',
      tipoMovimiento: 'Entrada',
      cantidad: 5,
      precioUnitario: 320.0,
      motivo: 'Reposición',
      fechaMovimiento: '2026-05-24',
    },
  ]);

  badgeClases(tipo: string): string {
    if (tipo === 'Entrada') return 'bg-green-100 text-green-700';
    if (tipo === 'Salida') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  }
}
```

- [ ] **Step 4: Crear el template HTML**

Crear `src/app/pages/movimientos/movimientos.component.html`:

```html
<div class="p-6">
  <div class="mb-6">
    <h1 class="text-2xl font-semibold text-gray-800">Movimientos</h1>
    <p class="text-sm text-gray-500 mt-1">Historial de movimientos de inventario</p>
  </div>

  <div class="bg-white rounded border border-gray-200">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-200">
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
          <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</th>
          <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio Unit.</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Motivo</th>
        </tr>
      </thead>
      <tbody>
        @for (mov of movimientos(); track mov.idMovimiento) {
          <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-500">{{ mov.fechaMovimiento }}</td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ mov.nombreProducto }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium {{ badgeClases(mov.tipoMovimiento) }}">
                {{ mov.tipoMovimiento }}
              </span>
            </td>
            <td class="px-4 py-3 text-right text-gray-700">{{ mov.cantidad }}</td>
            <td class="px-4 py-3 text-right text-gray-700">${{ mov.precioUnitario.toFixed(2) }}</td>
            <td class="px-4 py-3 text-gray-500">{{ mov.motivo ?? '—' }}</td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>
```

- [ ] **Step 5: Crear el archivo CSS vacío**

Crear `src/app/pages/movimientos/movimientos.component.css` con contenido vacío.

- [ ] **Step 6: Correr los tests y verificar que pasen**

```bash
npx ng test --include="**/movimientos.component.spec.ts"
```

Resultado esperado: 5 tests PASS

- [ ] **Step 7: Correr suite completa para verificar sin regresiones**

```bash
npm test
```

Resultado esperado: todos los tests existentes siguen en verde.

- [ ] **Step 8: Commit**

```bash
git add src/app/pages/movimientos/
git commit -m "feat: agregar MovimientosComponent con tabla visual y datos mockeados"
```

---

## Task 2: Configurar ruta /movimientos en el router

**Files:**
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.routes.spec.ts`

- [ ] **Step 1: Escribir el test de ruta (fase roja)**

Editar `src/app/app.routes.spec.ts` — reemplazar el contenido completo:

```ts
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
```

- [ ] **Step 2: Correr el test y verificar que falla**

```bash
npx ng test --include="**/app.routes.spec.ts"
```

Resultado esperado: FAIL — `expected false to be true` en el test de `/movimientos`

- [ ] **Step 3: Agregar la ruta en app.routes.ts**

Editar `src/app/app.routes.ts` — reemplazar el contenido completo:

```ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { MovimientosComponent } from './pages/movimientos/movimientos.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'movimientos', component: MovimientosComponent },
    ],
  },
];
```

- [ ] **Step 4: Correr el test de ruta y verificar que pasa**

```bash
npx ng test --include="**/app.routes.spec.ts"
```

Resultado esperado: 2 tests PASS

- [ ] **Step 5: Correr suite completa para verificar sin regresiones**

```bash
npm test
```

Resultado esperado: todos los tests en verde.

- [ ] **Step 6: Commit**

```bash
git add src/app/app.routes.ts src/app/app.routes.spec.ts
git commit -m "feat: configurar ruta /movimientos en el router"
```
