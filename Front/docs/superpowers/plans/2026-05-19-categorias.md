# Vista Categorías — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la vista `/categorias` con tabla visual (datos mockeados) y conectarla al router de Angular.

**Architecture:** Componente standalone `CategoriasComponent` con un signal de datos mockeados. Se agrega como ruta hija de `LayoutComponent` en `app.routes.ts`. Sin llamadas HTTP ni lógica de acciones.

**Tech Stack:** Angular 21, Tailwind CSS v4, Vitest, TypeScript strict

---

## Estructura de archivos

| Archivo | Acción |
|---|---|
| `src/app/pages/categorias/categorias.component.ts` | Crear |
| `src/app/pages/categorias/categorias.component.html` | Crear |
| `src/app/pages/categorias/categorias.component.css` | Crear (vacío) |
| `src/app/pages/categorias/categorias.component.spec.ts` | Crear |
| `src/app/app.routes.ts` | Modificar |

---

### Task 1: CategoriasComponent

**Files:**
- Create: `src/app/pages/categorias/categorias.component.spec.ts`
- Create: `src/app/pages/categorias/categorias.component.ts`
- Create: `src/app/pages/categorias/categorias.component.html`
- Create: `src/app/pages/categorias/categorias.component.css`

- [ ] **Step 1: Escribir el test**

Crear `src/app/pages/categorias/categorias.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasComponent } from './categorias.component';

describe('CategoriasComponent', () => {
  let fixture: ComponentFixture<CategoriasComponent>;
  let component: CategoriasComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should tener 3 categorías mockeadas', () => {
    expect(component.categorias().length).toBe(3);
  });

  it('should mostrar título "Categorías"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Categorías');
  });

  it('should renderizar 3 filas en la tabla', () => {
    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas.length).toBe(3);
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

```bash
npx ng test --include="**/categorias.component.spec.ts"
```

Resultado esperado: **FAIL** — `Cannot find module './categorias.component'`

- [ ] **Step 3: Crear el componente TypeScript**

Crear `src/app/pages/categorias/categorias.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  imports: [],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent {
  readonly categorias = signal<Categoria[]>([
    { idCategoria: 1, nombre: 'Electrónica', descripcion: 'Dispositivos y accesorios electrónicos' },
    { idCategoria: 2, nombre: 'Indumentaria', descripcion: 'Ropa y accesorios' },
    { idCategoria: 3, nombre: 'Oficina', descripcion: 'Insumos y mobiliario de oficina' },
  ]);
}
```

- [ ] **Step 4: Crear el template HTML**

Crear `src/app/pages/categorias/categorias.component.html`:

```html
<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold text-gray-800">Categorías</h1>
    <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded">
      + Nueva categoría
    </button>
  </div>

  <div class="bg-white rounded border border-gray-200">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-200">
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Nombre
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Descripción
          </th>
          <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        @for (cat of categorias(); track cat.idCategoria) {
          <tr class="border-b border-gray-100 last:border-0">
            <td class="px-4 py-3 font-medium text-gray-900">{{ cat.nombre }}</td>
            <td class="px-4 py-3 text-gray-500">{{ cat.descripcion }}</td>
            <td class="px-4 py-3 text-right space-x-3">
              <button class="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
              <button class="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>
```

- [ ] **Step 5: Crear el archivo CSS vacío**

Crear `src/app/pages/categorias/categorias.component.css` con contenido vacío.

- [ ] **Step 6: Correr el test para verificar que pasa**

```bash
npx ng test --include="**/categorias.component.spec.ts"
```

Resultado esperado: **PASS** — 4 tests pasando

- [ ] **Step 7: Commit**

```bash
git add src/app/pages/categorias/
git commit -m "feat: agregar CategoriasComponent con tabla visual y datos mockeados"
```

---

### Task 2: Configurar ruta /categorias

**Files:**
- Modify: `src/app/app.routes.ts`

- [ ] **Step 1: Escribir el test de ruta**

Crear `src/app/app.routes.spec.ts` (si no existe) o agregar al existente.

Crear `src/app/app.routes.spec.ts`:

```typescript
import { routes } from './app.routes';

describe('app.routes', () => {
  it('should tener ruta /categorias como hija del layout', () => {
    const layout = routes[0];
    const children = layout.children ?? [];
    expect(children.some(r => r.path === 'categorias')).toBe(true);
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

```bash
npx ng test --include="**/app.routes.spec.ts"
```

Resultado esperado: **FAIL** — `Expected false to be true`

- [ ] **Step 3: Agregar la ruta en app.routes.ts**

Reemplazar el contenido de `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriasComponent },
    ],
  },
];
```

- [ ] **Step 4: Correr el test para verificar que pasa**

```bash
npx ng test --include="**/app.routes.spec.ts"
```

Resultado esperado: **PASS** — 1 test pasando

- [ ] **Step 5: Correr todos los tests para verificar que no hay regresiones**

```bash
npm test
```

Resultado esperado: **PASS** — todos los tests en verde

- [ ] **Step 6: Commit**

```bash
git add src/app/app.routes.ts src/app/app.routes.spec.ts
git commit -m "feat: configurar ruta /categorias en el router"
```
