# Spec: Vista Movimientos

**Fecha:** 2026-05-25  
**Estado:** Aprobado

## Objetivo

Vista de solo lectura que lista todos los movimientos de inventario registrados por el sistema. Los datos vendrán del backend en el futuro; por ahora usa datos mockeados siguiendo el mismo patrón que CategoriasComponent.

## Componente

- **Ruta:** `src/app/pages/movimientos/movimientos.component.ts`
- **Selector:** `app-movimientos`
- **Patrón:** Standalone, signal, sin servicios por ahora

## Modelo

Usa `Movimiento` y `TipoMovimiento` de `src/app/models/movimiento.model.ts`:

```ts
export type TipoMovimiento = 'Entrada' | 'Salida' | 'Ajuste';

export interface Movimiento {
  idMovimiento: number;
  idProducto: number;
  nombreProducto: string;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  motivo?: string;
  fechaMovimiento: string;
}
```

## Vista

Tabla con columnas:

| Columna         | Campo fuente       | Notas                          |
|-----------------|--------------------|--------------------------------|
| Fecha           | `fechaMovimiento`  | Formato `dd/MM/yyyy`           |
| Producto        | `nombreProducto`   |                                |
| Tipo            | `tipoMovimiento`   | Badge de color (ver abajo)     |
| Cantidad        | `cantidad`         |                                |
| Precio Unitario | `precioUnitario`   | Prefijo `$`                    |
| Motivo          | `motivo`           | Mostrar `—` si está vacío      |

### Badges de tipo

- `Entrada` → `bg-green-100 text-green-700`
- `Salida` → `bg-red-100 text-red-700`
- `Ajuste` → `bg-yellow-100 text-yellow-700`

### Header

Título `Movimientos` con subtítulo `Historial de movimientos de inventario`, consistente con el estilo de CategoriasComponent.

## Mock data

5 filas con mezcla de los 3 tipos:

```ts
[
  { idMovimiento: 1, idProducto: 1, nombreProducto: 'Notebook Lenovo', tipoMovimiento: 'Entrada', cantidad: 10, precioUnitario: 850.00, motivo: 'Compra proveedor', fechaMovimiento: '2026-05-20' },
  { idMovimiento: 2, idProducto: 2, nombreProducto: 'Mouse Logitech', tipoMovimiento: 'Salida', cantidad: 3, precioUnitario: 25.00, motivo: 'Venta', fechaMovimiento: '2026-05-21' },
  { idMovimiento: 3, idProducto: 3, nombreProducto: 'Teclado Mecánico', tipoMovimiento: 'Ajuste', cantidad: -2, precioUnitario: 45.00, motivo: 'Corrección inventario', fechaMovimiento: '2026-05-22' },
  { idMovimiento: 4, idProducto: 1, nombreProducto: 'Notebook Lenovo', tipoMovimiento: 'Salida', cantidad: 2, precioUnitario: 850.00, fechaMovimiento: '2026-05-23' },
  { idMovimiento: 5, idProducto: 4, nombreProducto: 'Monitor Samsung', tipoMovimiento: 'Entrada', cantidad: 5, precioUnitario: 320.00, motivo: 'Reposición', fechaMovimiento: '2026-05-24' },
]
```

## Ruta

Agregar en `app.routes.ts` como ruta hija de LayoutComponent:

```ts
{ path: 'movimientos', component: MovimientosComponent }
```

## Tests

4 tests en `movimientos.component.spec.ts`:

1. Renderiza el título "Movimientos"
2. Muestra todas las filas mockeadas (5 filas)
3. Muestra badge "Entrada" con clase `text-green-700`
4. Muestra badge "Salida" con clase `text-red-700`

Test de ruta en `app.routes.spec.ts`:

5. La ruta `/movimientos` apunta a `MovimientosComponent`

## Estilo

Consistente con CategoriasComponent: fondo blanco, tabla con `divide-y`, header gris claro, hover en filas. Tailwind CSS v4.
