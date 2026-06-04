# Editar Producto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar modal de edición de productos que se abre al hacer click en "Editar", conectado al backend via `PUT /api/productos/{id}`.

**Architecture:** Tres cambios en secuencia: (1) método `editarProducto` en el servicio, (2) componente modal standalone `EditarProductoModalComponent` con formulario completo y dropdown de categorías, (3) integración en `ProductosComponent` conectando el botón y el modal. El modal recibe el producto via `input.required<Producto>()`, puebla el formulario con `effect()` y emite `productoEditado` al guardar.

**Tech Stack:** Angular 21 standalone, signals (`signal`, `input`, `output`, `effect`), Vitest + Angular TestBed, HttpTestingController, Tailwind CSS v4.

---

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/app/services/inventario.service.ts` | Modificar — agregar `editarProducto()` |
| `src/app/services/inventario.service.spec.ts` | Modificar — agregar test |
| `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.ts` | Crear |
| `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.html` | Crear |
| `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.css` | Crear (vacío) |
| `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.spec.ts` | Crear |
| `src/app/pages/productos/productos.component.ts` | Modificar |
| `src/app/pages/productos/productos.component.html` | Modificar |
| `src/app/pages/productos/productos.component.spec.ts` | Crear |

---

## Task 1: editarProducto en InventarioService

**Files:**
- Modify: `src/app/services/inventario.service.ts`
- Modify: `src/app/services/inventario.service.spec.ts`

- [ ] **Step 1: Agregar el test en `inventario.service.spec.ts`**

Abrir `src/app/services/inventario.service.spec.ts`. Reemplazar la línea de import que importa `CategoriaCrear` por la siguiente (agrega `Producto` y `ProductoEditar`):

```ts
import { CategoriaCrear } from '../models/categoria.model';
import { Producto, ProductoEditar } from '../models/producto.model';
```

Agregar este test al final del bloque `describe`, antes del `}`  de cierre:

```ts
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
```

- [ ] **Step 2: Correr el test y verificar que falla**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Esperado: FAIL con `servicio.editarProducto is not a function` o similar.

- [ ] **Step 3: Agregar `editarProducto` en `inventario.service.ts`**

Agregar el import de `ProductoEditar` y `Producto` a la línea existente de imports del modelo de producto. Actualmente la línea dice:

```ts
import { Producto } from '../models/producto.model';
```

Cambiarla a:

```ts
import { Producto, ProductoEditar } from '../models/producto.model';
```

Agregar el método al final de la clase, después de `editarCategoria`:

```ts
  editarProducto(id: number, data: ProductoEditar): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}`, data);
  }
```

- [ ] **Step 4: Correr el test y verificar que pasa**

```bash
npx ng test --include="**/inventario.service.spec.ts"
```

Esperado: todos los tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/inventario.service.ts src/app/services/inventario.service.spec.ts
git commit -m "feat: agregar editarProducto al InventarioService"
```

---

## Task 2: EditarProductoModalComponent

**Files:**
- Create: `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.spec.ts`
- Create: `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.ts`
- Create: `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.html`
- Create: `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.css`

- [ ] **Step 1: Crear el spec file**

Crear `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.spec.ts`:

```ts
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
```

- [ ] **Step 2: Correr el spec y verificar que falla**

```bash
npx ng test --include="**/editar-producto-modal.component.spec.ts"
```

Esperado: FAIL con `Cannot find module './editar-producto-modal.component'`.

- [ ] **Step 3: Crear el componente `.ts`**

Crear `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.ts`:

```ts
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { Producto, ProductoEditar } from '../../../models/producto.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-editar-producto-modal',
  imports: [],
  templateUrl: './editar-producto-modal.component.html',
  styleUrl: './editar-producto-modal.component.css',
})
export class EditarProductoModalComponent {
  private inventarioService = inject(InventarioService);

  nombre = signal('');
  descripcion = signal('');
  codigo = signal('');
  precioUnitario = signal(0);
  idCategoria = signal(0);
  categorias = signal<Categoria[]>([]);
  guardando = signal(false);
  errorNombre = signal(false);
  errorPrecio = signal(false);
  errorApi = signal(false);

  productoInput = input.required<Producto>();
  productoEditado = output<Producto>();
  cerrar = output<void>();

  constructor() {
    this.inventarioService.getCategorias().subscribe(cats => this.categorias.set(cats));

    effect(() => {
      const p = this.productoInput();
      this.nombre.set(p.nombre);
      this.descripcion.set(p.descripcion ?? '');
      this.codigo.set(p.codigo ?? '');
      this.precioUnitario.set(p.precioUnitario);
      this.idCategoria.set(p.idCategoria);
    });
  }

  guardar() {
    if (!this.nombre().trim()) {
      this.errorNombre.set(true);
      return;
    }
    if (this.precioUnitario() <= 0) {
      this.errorPrecio.set(true);
      return;
    }
    this.guardando.set(true);
    this.errorApi.set(false);
    const payload: ProductoEditar = {
      idCategoria: this.idCategoria(),
      nombre: this.nombre().trim(),
      descripcion: this.descripcion() || null,
      codigo: this.codigo() || null,
      precioUnitario: this.precioUnitario(),
    };
    this.inventarioService.editarProducto(this.productoInput().idProducto, payload).subscribe({
      next: prod => {
        this.guardando.set(false);
        this.productoEditado.emit(prod);
      },
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

- [ ] **Step 4: Crear el template `.html`**

Crear `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.html`:

```html
<div
  data-testid="overlay"
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  (click)="cancelar()"
>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Editar producto</h2>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
      <input
        name="nombre"
        type="text"
        [value]="nombre()"
        (input)="nombre.set($any($event.target).value); errorNombre.set(false)"
        [class]="'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ' + (errorNombre() ? 'border-red-500' : 'border-gray-300')"
        placeholder="Nombre del producto"
      />
      @if (errorNombre()) {
        <p class="text-red-500 text-xs mt-1">El nombre es requerido</p>
      }
    </div>

    <div class="mb-4">
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

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
      <input
        name="codigo"
        type="text"
        [value]="codigo()"
        (input)="codigo.set($any($event.target).value)"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Código del producto"
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Precio unitario *</label>
      <input
        name="precioUnitario"
        type="number"
        [value]="precioUnitario()"
        (input)="precioUnitario.set(+$any($event.target).value); errorPrecio.set(false)"
        [class]="'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ' + (errorPrecio() ? 'border-red-500' : 'border-gray-300')"
        placeholder="0"
      />
      @if (errorPrecio()) {
        <p class="text-red-500 text-xs mt-1">El precio debe ser mayor a 0</p>
      }
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
      <select
        name="idCategoria"
        (change)="idCategoria.set(+$any($event.target).value)"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        @for (cat of categorias(); track cat.idCategoria) {
          <option [value]="cat.idCategoria" [selected]="cat.idCategoria === idCategoria()">
            {{ cat.nombre }}
          </option>
        }
      </select>
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
        data-testid="btn-guardar"
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

- [ ] **Step 5: Crear el CSS vacío**

Crear `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.css` con contenido vacío.

- [ ] **Step 6: Correr los tests y verificar que pasan**

```bash
npx ng test --include="**/editar-producto-modal.component.spec.ts"
```

Esperado: todos los tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/pages/productos/editar-producto-modal/
git commit -m "feat: agregar EditarProductoModalComponent con TDD"
```

---

## Task 3: Integrar en ProductosComponent

**Files:**
- Create: `src/app/pages/productos/productos.component.spec.ts`
- Modify: `src/app/pages/productos/productos.component.ts`
- Modify: `src/app/pages/productos/productos.component.html`

- [ ] **Step 1: Crear el spec de ProductosComponent**

Crear `src/app/pages/productos/productos.component.spec.ts`:

```ts
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
```

- [ ] **Step 2: Correr el spec y verificar que falla**

```bash
npx ng test --include="**/productos.component.spec.ts"
```

Esperado: FAIL con errores sobre `mostrarModalEditar`, `abrirEditar`, `onProductoEditado` no definidos.

- [ ] **Step 3: Actualizar `productos.component.ts`**

Reemplazar el contenido completo de `src/app/pages/productos/productos.component.ts`:

```ts
import { Component, inject, signal } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { InventarioService } from '../../services/inventario.service';
import { EditarProductoModalComponent } from './editar-producto-modal/editar-producto-modal.component';

@Component({
  selector: 'app-productos',
  imports: [EditarProductoModalComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent {
  private inventarioService = inject(InventarioService);

  productos = signal<Producto[]>([]);
  mostrarModalEditar = signal(false);
  productoSeleccionado = signal<Producto | null>(null);

  constructor() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.inventarioService.getProductos().subscribe(data => this.productos.set(data));
  }

  abrirEditar(prod: Producto) {
    this.productoSeleccionado.set(prod);
    this.mostrarModalEditar.set(true);
  }

  onProductoEditado() {
    this.mostrarModalEditar.set(false);
    this.cargarProductos();
  }
}
```

- [ ] **Step 4: Actualizar `productos.component.html`**

Reemplazar el contenido completo de `src/app/pages/productos/productos.component.html`:

```html
<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold text-gray-800">Productos</h1>
    <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded">
      + Producto
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
            Codigo
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categoria
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Precio
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Stock
          </th>
          <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        @for (prdt of productos(); track prdt.idProducto) {
          <tr class="border-b border-gray-100 last:border-0">
            <td class="px-4 py-3 font-medium text-gray-900">{{ prdt.nombre }}</td>
            <td class="px-4 py-3 text-gray-500">{{ prdt.codigo }}</td>
            <td class="px-4 py-3 text-gray-500">{{ prdt.nombreCategoria }}</td>
            <td class="px-4 py-3 text-gray-500">{{ prdt.precioUnitario }}</td>
            <td class="px-4 py-3 text-gray-500">{{ prdt.stock }}</td>
            <td class="px-4 py-3 text-right space-x-3">
              <button
                class="text-blue-600 hover:text-blue-800 text-sm"
                (click)="abrirEditar(prdt)"
              >
                Editar
              </button>
              <button class="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>

@if (mostrarModalEditar()) {
  <app-editar-producto-modal
    [productoInput]="productoSeleccionado()!"
    (productoEditado)="onProductoEditado()"
    (cerrar)="mostrarModalEditar.set(false)"
  />
}
```

- [ ] **Step 5: Correr todos los tests y verificar que pasan**

```bash
npx ng test
```

Esperado: todos los tests PASS (incluyendo los 3 nuevos de ProductosComponent y todos los anteriores).

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/productos/
git commit -m "feat: integrar EditarProductoModalComponent en ProductosComponent"
```
