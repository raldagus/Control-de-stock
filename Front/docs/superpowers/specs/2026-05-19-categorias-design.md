# Spec: Vista Categorías

**Fecha:** 2026-05-19  
**Estado:** Aprobado

## Objetivo

Crear la vista `/categorias` que muestra una tabla con las categorías del inventario. Por ahora solo visual, con datos mockeados.

## Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `src/app/pages/categorias/categorias.component.ts` | Crear |
| `src/app/pages/categorias/categorias.component.html` | Crear |
| `src/app/pages/categorias/categorias.component.css` | Crear (vacío) |
| `src/app/app.routes.ts` | Modificar — agregar ruta `/categorias` |

## Componente

**`categorias.component.ts`**
- Standalone, sin NgModules
- Signal `categorias = signal<Categoria[]>([...])` con 3 items mockeados:
  - `{ idCategoria: 1, nombre: 'Electrónica', descripcion: 'Dispositivos y accesorios electrónicos' }`
  - `{ idCategoria: 2, nombre: 'Indumentaria', descripcion: 'Ropa y accesorios' }`
  - `{ idCategoria: 3, nombre: 'Oficina', descripcion: 'Insumos y mobiliario de oficina' }`
- Sin métodos de acción (editar/eliminar no funcionales)
- Importa: `CommonModule` o `@for` / `@if` (control flow Angular 17+)

## Template

**Header:**
- Título `h1` "Categorías" alineado a la izquierda
- Botón `+ Nueva categoría` alineado a la derecha, estilo `bg-indigo-600 text-white`
- Sin `(click)` handler

**Tabla:**
- Fondo blanco, borde gris suave, bordes redondeados
- Encabezados: NOMBRE / DESCRIPCIÓN / ACCIONES (texto uppercase, gris, pequeño)
- Por cada categoría (`@for`):
  - Nombre: texto negro, semi-negrita
  - Descripción: texto gris
  - Acciones: botón `Editar` (texto azul) y `Eliminar` (texto rojo), sin handler

## Ruta

```typescript
{ path: 'categorias', component: CategoriasComponent }
```
Agregada como hijo de `LayoutComponent` en `app.routes.ts`.

## Restricciones

- Solo visual: ningún botón ejecuta lógica
- Sin llamadas HTTP
- Tailwind puro, sin CSS adicional en el `.css`
- Datos mockeados respetan la interfaz `Categoria` del modelo existente
