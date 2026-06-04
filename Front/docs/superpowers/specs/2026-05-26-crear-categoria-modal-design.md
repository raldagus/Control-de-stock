# Spec: Modal Crear Categoría

**Fecha:** 2026-05-26  
**Componente afectado:** `CategoriasComponent`

## Objetivo

Agregar un modal para crear una nueva categoría desde la vista `/categorias`. El modal vive en un componente separado, llama al API real y, al tener éxito, refresca la lista de categorías.

## Arquitectura

### Nuevo componente

`CrearCategoriaModalComponent` — standalone, ubicado en:

```
src/app/pages/categorias/crear-categoria-modal/
  crear-categoria-modal.component.ts
  crear-categoria-modal.component.html
  crear-categoria-modal.component.css
  crear-categoria-modal.component.spec.ts
```

### Cambios en componentes existentes

**`CategoriasComponent`:**
- Agrega `mostrarModal = signal(false)`
- El botón "+ Nueva categoría" llama a `mostrarModal.set(true)`
- Renderiza `<app-crear-categoria-modal>` condicionalmente con `@if (mostrarModal())`
- Escucha el output `categoriaCreada` → llama a `getCategorias()` y actualiza el signal `categorias`; cierra el modal con `mostrarModal.set(false)`
- Escucha el output `cerrar` → llama a `mostrarModal.set(false)`

**`InventarioService`:**
- Agrega `crearCategoria(data: CategoriaCrear): Observable<Categoria>` → `POST /api/categorias`

## Interfaz del componente

```typescript
// Inputs
// (ninguno)

// Outputs
categoriaCreada = output<Categoria>();
cerrar = output<void>();
```

## Formulario

| Campo        | Tipo     | Requerido | Validación                    |
|--------------|----------|-----------|-------------------------------|
| `nombre`     | input    | sí        | no vacío                      |
| `descripcion`| textarea | no        | ninguna                       |

### Comportamiento de validación

- La validación se dispara al hacer click en "Guardar"
- Si `nombre` está vacío: muestra mensaje inline "El nombre es requerido" debajo del campo
- No se llama al API si la validación falla

## Estado interno del componente

```typescript
nombre = signal('');
descripcion = signal('');
guardando = signal(false);
errorNombre = signal(false);
errorApi = signal(false);
```

## Flujo de submit

1. Usuario hace click en "Guardar"
2. Si `nombre` vacío → `errorNombre.set(true)`, detener
3. `guardando.set(true)`, `errorApi.set(false)`
4. Llama a `inventarioService.crearCategoria({ nombre, descripcion })`
5. **Éxito:** emite `categoriaCreada`, el padre refresca lista y cierra modal
6. **Error:** `guardando.set(false)`, `errorApi.set(true)`, muestra mensaje genérico

## Diseño visual

- Overlay: `fixed inset-0 bg-black/50 flex items-center justify-center z-50`
- Tarjeta: `bg-white rounded-lg shadow-xl w-full max-w-md p-6`
- Click en el overlay emite `cerrar` (equivalente a cancelar)
- Paleta consistente con el resto del proyecto: indigo para acciones primarias, gray para secundarias
- Botón "Guardar" deshabilitado mientras `guardando()` es `true`

## Testing

- Test: renderiza el modal con campos nombre y descripcion
- Test: botón "Guardar" con nombre vacío muestra error "El nombre es requerido"
- Test: submit exitoso emite `categoriaCreada`
- Test: botón "Cancelar" emite `cerrar`
- Test: click en overlay emite `cerrar`

## Cambios en `app.routes.ts`

Ninguno — la ruta `/categorias` ya existe.
