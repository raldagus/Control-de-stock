# Modal Crear Categoría — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un componente modal standalone `CrearCategoriaModalComponent` que permite crear una categoría llamando al API real, integrado en `CategoriasComponent`.

**Architecture:** Componente modal separado con signals y output() para comunicación hacia el padre. El padre controla visibilidad con `mostrarModal = signal(false)`. Al éxito, el padre refresca la lista con un nuevo GET.

**Tech Stack:** Angular 21 standalone, signals, output(), HttpClient, Tailwind CSS v4, Vitest + TestBed.

---

## Archivos afectados

| Acción   | Ruta                                                                                         |
|----------|----------------------------------------------------------------------------------------------|
| Modificar | `src/app/services/inventario.service.ts`                                                    |
| Modificar | `src/app/services/inventario.service.spec.ts`                                               |
| Crear    | `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.ts`          |
| Crear    | `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.html`        |
| Crear    | `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.css`         |
| Crear    | `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.spec.ts`     |
| Modificar | `src/app/pages/categorias/categorias.component.ts`                                          |
| Modificar | `src/app/pages/categorias/categorias.component.html`                                        |
| Modificar | `src/app/pages/categorias/categorias.component.spec.ts`                                     |

---

## Task 1: Agregar `crearCategoria` al InventarioService

**Files:**
- Modify: `src/app/services/inventario.service.ts`
- Modify: `src/app/services/inventario.service.spec.ts`

- [ ] **Paso 1: Agregar test que falla en `inventario.service.spec.ts`**

Abrir `src/app/services/inventario.service.spec.ts` y agregar este test dentro del `describe` existente, después del último `it`:

```typescript
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
```

También agregar el import de `CategoriaCrear` en la línea de imports del archivo (actualmente solo importa `InventarioService`):

```typescript
import { InventarioService } from './inventario.service';
import { CategoriaCrear } from '../models/categoria.model';
```

- [ ] **Paso 2: Verificar que el test falla**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Resultado esperado: FAIL — `Property 'crearCategoria' does not exist on type 'InventarioService'`

- [ ] **Paso 3: Implementar `crearCategoria` en `inventario.service.ts`**

Agregar el import de `CategoriaCrear` al import existente de `Categoria`:

```typescript
import { Categoria, CategoriaCrear } from '../models/categoria.model';
```

Agregar el método al final de la clase (antes del cierre `}`):

```typescript
  crearCategoria(data: CategoriaCrear): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/categorias`, data);
  }
```

- [ ] **Paso 4: Verificar que el test pasa**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Resultado esperado: PASS — 3 tests pasando

- [ ] **Paso 5: Commit**

```bash
git add src/app/services/inventario.service.ts src/app/services/inventario.service.spec.ts
git commit -m "feat: agregar crearCategoria al InventarioService"
```

---

## Task 2: Crear `CrearCategoriaModalComponent` (TDD)

**Files:**
- Create: `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.spec.ts`
- Create: `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.ts`
- Create: `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.html`
- Create: `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.css`

- [ ] **Paso 1: Crear la carpeta del componente**

```bash
mkdir src/app/pages/categorias/crear-categoria-modal
```

- [ ] **Paso 2: Crear el spec con los 5 tests (fase roja)**

Crear `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CrearCategoriaModalComponent } from './crear-categoria-modal.component';
import { InventarioService } from '../../../services/inventario.service';

const mockService = {
  crearCategoria: () => of({ idCategoria: 1, nombre: 'Test', descripcion: null }),
};

describe('CrearCategoriaModalComponent', () => {
  let fixture: ComponentFixture<CrearCategoriaModalComponent>;
  let component: CrearCategoriaModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCategoriaModalComponent],
      providers: [{ provide: InventarioService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearCategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza campo nombre y textarea descripcion', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('input[name="nombre"]')).toBeTruthy();
    expect(el.querySelector('textarea[name="descripcion"]')).toBeTruthy();
  });

  it('muestra "El nombre es requerido" cuando nombre está vacío al guardar', () => {
    component.guardar();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('El nombre es requerido');
  });

  it('emite categoriaCreada con la categoría devuelta por el servicio', () => {
    const resultado: any[] = [];
    component.categoriaCreada.subscribe(cat => resultado.push(cat));

    component.nombre.set('Electrónica');
    component.guardar();

    expect(resultado.length).toBe(1);
    expect(resultado[0]).toEqual({ idCategoria: 1, nombre: 'Test', descripcion: null });
  });

  it('emite cerrar al hacer click en el botón Cancelar', () => {
    let emitido = false;
    component.cerrar.subscribe(() => (emitido = true));

    const btn = fixture.nativeElement.querySelector('[data-testid="btn-cancelar"]') as HTMLButtonElement;
    btn.click();

    expect(emitido).toBe(true);
  });

  it('emite cerrar al hacer click en el overlay', () => {
    let emitido = false;
    component.cerrar.subscribe(() => (emitido = true));

    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;
    overlay.click();

    expect(emitido).toBe(true);
  });
});
```

- [ ] **Paso 3: Verificar que los tests fallan con "Cannot find module"**

```bash
npx ng test --include="**/crear-categoria-modal.component.spec.ts"
```

Resultado esperado: FAIL — `Cannot find module './crear-categoria-modal.component'`

- [ ] **Paso 4: Crear el componente TypeScript**

Crear `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.ts`:

```typescript
import { Component, inject, output, signal } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-crear-categoria-modal',
  imports: [],
  templateUrl: './crear-categoria-modal.component.html',
  styleUrl: './crear-categoria-modal.component.css',
})
export class CrearCategoriaModalComponent {
  private inventarioService = inject(InventarioService);

  nombre = signal('');
  descripcion = signal('');
  guardando = signal(false);
  errorNombre = signal(false);
  errorApi = signal(false);

  categoriaCreada = output<Categoria>();
  cerrar = output<void>();

  guardar() {
    if (!this.nombre().trim()) {
      this.errorNombre.set(true);
      return;
    }
    this.guardando.set(true);
    this.errorApi.set(false);
    this.inventarioService
      .crearCategoria({ nombre: this.nombre().trim(), descripcion: this.descripcion() || null })
      .subscribe({
        next: cat => this.categoriaCreada.emit(cat),
        error: () => {
          this.guardando.set(false);
          this.errorApi.set(true);
        },
      });
  }

  cancelar() {
    this.cerrar.emit();
  }
}
```

- [ ] **Paso 5: Crear el template HTML**

Crear `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.html`:

```html
<div
  data-testid="overlay"
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  (click)="cancelar()"
>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Nueva categoría</h2>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
      <input
        name="nombre"
        type="text"
        [value]="nombre()"
        (input)="nombre.set($any($event.target).value); errorNombre.set(false)"
        [class]="'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ' + (errorNombre() ? 'border-red-500' : 'border-gray-300')"
        placeholder="Nombre de la categoría"
      />
      @if (errorNombre()) {
        <p class="text-red-500 text-xs mt-1">El nombre es requerido</p>
      }
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
      <textarea
        name="descripcion"
        [value]="descripcion()"
        (input)="descripcion.set($any($event.target).value)"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="3"
        placeholder="Descripción opcional"
      ></textarea>
    </div>

    @if (errorApi()) {
      <p class="text-red-500 text-sm mb-4">Ocurrió un error al guardar. Intentá de nuevo.</p>
    }

    <div class="flex justify-end space-x-3">
      <button
        data-testid="btn-cancelar"
        type="button"
        (click)="cancelar()"
        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
      >
        Cancelar
      </button>
      <button
        type="button"
        (click)="guardar()"
        [disabled]="guardando()"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded disabled:opacity-50"
      >
        {{ guardando() ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </div>
</div>
```

- [ ] **Paso 6: Crear el archivo CSS vacío**

Crear `src/app/pages/categorias/crear-categoria-modal/crear-categoria-modal.component.css` con contenido vacío.

- [ ] **Paso 7: Verificar que los 5 tests pasan**

```bash
npx ng test --include="**/crear-categoria-modal.component.spec.ts"
```

Resultado esperado: PASS — 5 tests pasando

- [ ] **Paso 8: Verificar suite completa sin regresiones**

```bash
npx ng test
```

Resultado esperado: todos los tests pasan

- [ ] **Paso 9: Commit**

```bash
git add src/app/pages/categorias/crear-categoria-modal/
git commit -m "feat: agregar CrearCategoriaModalComponent con TDD"
```

---

## Task 3: Integrar modal en `CategoriasComponent`

**Files:**
- Modify: `src/app/pages/categorias/categorias.component.ts`
- Modify: `src/app/pages/categorias/categorias.component.html`
- Modify: `src/app/pages/categorias/categorias.component.spec.ts`

**Contexto:** El spec actual de `CategoriasComponent` no mockea el servicio (hereda HttpClient implícitamente porque el componente tiene datos mockeados en el constructor). Al actualizar el componente para llamar al API, el spec debe proveer un mock del servicio. El spec también debe actualizarse para cubrir la lógica del modal.

- [ ] **Paso 1: Actualizar `categorias.component.ts`**

Reemplazar el contenido completo de `src/app/pages/categorias/categorias.component.ts`:

```typescript
import { Component, inject, signal } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { InventarioService } from '../../services/inventario.service';
import { CrearCategoriaModalComponent } from './crear-categoria-modal/crear-categoria-modal.component';

@Component({
  selector: 'app-categorias',
  imports: [CrearCategoriaModalComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent {
  private inventarioService = inject(InventarioService);

  categorias = signal<Categoria[]>([]);
  mostrarModal = signal(false);

  constructor() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.inventarioService.getCategorias().subscribe(data => {
      this.categorias.set(data);
    });
  }

  alCrearCategoria() {
    this.mostrarModal.set(false);
    this.cargarCategorias();
  }
}
```

- [ ] **Paso 2: Actualizar `categorias.component.html`**

Reemplazar el contenido completo de `src/app/pages/categorias/categorias.component.html`:

```html
<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold text-gray-800">Categorías</h1>
    <button
      (click)="mostrarModal.set(true)"
      class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
    >
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

@if (mostrarModal()) {
  <app-crear-categoria-modal
    (categoriaCreada)="alCrearCategoria()"
    (cerrar)="mostrarModal.set(false)"
  />
}
```

- [ ] **Paso 3: Reemplazar `categorias.component.spec.ts`**

Reemplazar el contenido completo de `src/app/pages/categorias/categorias.component.spec.ts`:

```typescript
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
    component.alCrearCategoria();
    expect(component.mostrarModal()).toBe(false);
    expect(component.categorias().length).toBe(3);
  });
});
```

- [ ] **Paso 4: Verificar que todos los tests del componente pasan**

```bash
npx ng test --include="**/categorias.component.spec.ts"
```

Resultado esperado: PASS — 7 tests pasando

- [ ] **Paso 5: Verificar suite completa sin regresiones**

```bash
npx ng test
```

Resultado esperado: todos los tests pasan

- [ ] **Paso 6: Commit**

```bash
git add src/app/pages/categorias/categorias.component.ts src/app/pages/categorias/categorias.component.html src/app/pages/categorias/categorias.component.spec.ts
git commit -m "feat: integrar CrearCategoriaModalComponent en CategoriasComponent"
```
