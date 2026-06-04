# Spec: Modal Editar Producto

**Fecha:** 2026-05-28  
**Referencia:** `EditarCategoriaModel` (patrón idéntico)

---

## Objetivo

Implementar un modal para editar los campos de un producto existente, activado desde el botón "Editar" en la tabla de `ProductosComponent`, conectado al backend vía `PUT /api/productos/{id}`.

---

## Componentes afectados

### 1. `InventarioService`
- Agregar método `editarProducto(id: number, data: ProductoEditar): Observable<Producto>`
- Llama `PUT ${baseUrl}/productos/${id}` con el body `data`

### 2. `EditarProductoModalComponent`
**Ruta:** `src/app/pages/productos/editar-producto-modal/editar-producto-modal.component.ts`

**Inputs / Outputs:**
- `productoInput = input.required<Producto>()` — recibe el producto a editar
- `productoEditado = output<Producto>()` — emite el producto actualizado al guardar
- `cerrar = output<void>()` — emite al cancelar o cerrar overlay

**Signals de estado:**
- `nombre = signal('')`
- `descripcion = signal('')`
- `codigo = signal('')`
- `precioUnitario = signal(0)`
- `idCategoria = signal(0)`
- `categorias = signal<Categoria[]>([])`
- `guardando = signal(false)`
- `errorNombre = signal(false)`
- `errorPrecio = signal(false)`
- `errorApi = signal(false)`

**Inicialización:**
- `constructor()` carga categorías via `getCategorias()`
- `effect()` puebla los signals cuando cambia `productoInput()`

**Método `guardar()`:**
1. Valida `nombre.trim()` no vacío → `errorNombre.set(true)` si falla
2. Valida `precioUnitario() > 0` → `errorPrecio.set(true)` si falla
3. Llama `inventarioService.editarProducto(productoInput().idProducto, { ... })`
4. En `next`: `guardando.set(false)` + emite `productoEditado`
5. En `error`: `guardando.set(false)` + `errorApi.set(true)`

**Método `cancelar()`:** emite `cerrar`

**Formulario (HTML):**
- Overlay con `data-testid="overlay"`, click cierra modal
- Campos: `nombre` (req), `descripcion` (textarea), `codigo`, `precioUnitario` (number), `idCategoria` (select con `@for` sobre `categorias()`)
- Mensajes de error inline para `errorNombre` y `errorPrecio`
- Mensaje de error API global
- Botón "Cancelar" y botón "Guardar" (disabled mientras `guardando()`)

### 3. `ProductosComponent`
**Cambios en `.ts`:**
- Agregar imports: `EditarProductoModalComponent`
- Agregar signals: `mostrarModalEditar = signal(false)`, `productoSeleccionado = signal<Producto | null>(null)`
- Agregar método `cargarProductos()` (extraer del constructor)
- Agregar método `abrirEditar(prod: Producto)`: setea `productoSeleccionado` y abre modal
- Agregar método `onProductoEditado()`: cierra modal + llama `cargarProductos()`

**Cambios en `.html`:**
- Botón "Editar" en cada fila: `(click)="abrirEditar(prdt)"`
- Al final del template: `@if (mostrarModalEditar())` con `<app-editar-producto-modal>`

---

## Convenciones seguidas

- Standalone component, sin NgModules
- Angular signals para todo el estado local
- `input()` / `output()` API moderna (no `@Input`/`@Output`)
- Tailwind v4 para estilos, consistente con el resto de modales
- Sin comentarios explicativos en el código

---

## Testing (TDD)

Todos los componentes y métodos de servicio siguen TDD:

**`InventarioService`** (nuevo test):
- `editarProducto()` llama `PUT /api/productos/{id}` con el body correcto

**`EditarProductoModalComponent`** (spec completo):
- Renderiza el formulario con los datos del producto recibido
- Valida nombre vacío → muestra error
- Valida precio inválido → muestra error
- Llama al servicio con los datos correctos al guardar
- Emite `productoEditado` al guardar exitosamente
- Emite `cerrar` al cancelar
- Click en overlay emite `cerrar`
- Muestra error API en caso de fallo del servicio
- Botón deshabilitado mientras `guardando()`

**`ProductosComponent`** (test actualizado):
- Botón "Editar" abre el modal con el producto correcto
- Modal emite `productoEditado` → recarga productos y cierra modal
