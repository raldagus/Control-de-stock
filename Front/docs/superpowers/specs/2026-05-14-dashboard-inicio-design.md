# Spec: Página de Inicio — Dashboard

**Fecha:** 2026-05-14  
**Proyecto:** pagina-stock (Angular 21)

---

## Objetivo

Construir la página de inicio del sistema de control de inventario: un dashboard con layout de sidebar + área principal, conectado a la API real en `https://localhost:7123/`.

---

## Estructura de archivos

```
src/app/
├── shared/
│   └── layout/
│       ├── layout.component.ts
│       ├── layout.component.html
│       └── layout.component.css
├── pages/
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.css
└── services/
    └── inventario.service.ts
```

---

## Rutas

```
/   → LayoutComponent (shell con sidebar)
  '' → DashboardComponent (ruta por defecto, redirectTo: '')
```

- `app.routes.ts` define la ruta raíz con `LayoutComponent` y una ruta hija vacía (`''`) que carga `DashboardComponent`.
- `app.config.ts` provee `HttpClient` via `provideHttpClient()`.

---

## Servicio: InventarioService

**Archivo:** `src/app/services/inventario.service.ts`

- Inyectable en root, usa `HttpClient`.
- URL base: `https://localhost:7123/api`
- Método `getDashboard()`: ejecuta `forkJoin` sobre:
  - `GET /api/categorias` → `Categoria[]`
  - `GET /api/productos` → `Producto[]`
- Retorna observable con:
  ```ts
  {
    totalCategorias: number,
    totalProductos: number,
    valorInventario: number,       // sum(precioUnitario * stock)
    productosStockBajo: Producto[] // stock < 5
  }
  ```

---

## Componente: LayoutComponent

**Standalone**, importa `RouterOutlet`, `RouterLink`, `RouterLinkActive`.

### Template

- `<aside>` fijo izquierdo, ancho `w-52`, fondo `bg-[#1e2330]`, altura full screen.
  - Header: texto "STOCK" (bold, blanco) + "Control de inventario" (pequeño, gris).
  - Lista de 4 links con ícono SVG inline:
    - Dashboard → `/`
    - Categorías → `/categorias`
    - Productos → `/productos`
    - Movimientos → `/movimientos`
  - Link activo: `bg-indigo-600 text-white rounded`, inactivo: `text-gray-300 hover:bg-gray-700`.
  - `routerLinkActive="..."` con `[routerLinkActiveOptions]="{ exact: true }"` para Dashboard.
- `<main>` ocupa el resto, `bg-gray-50 min-h-screen p-8`.
  - `<router-outlet />` dentro.

---

## Componente: DashboardComponent

**Standalone**, importa `CurrencyPipe` o formatea manualmente.

### Estado (signals)

```ts
totalCategorias = signal(0);
totalProductos = signal(0);
valorInventario = signal(0);
productosStockBajo = signal<Producto[]>([]);
cargando = signal(true);
error = signal<string | null>(null);
```

### Ciclo de vida

`ngOnInit` llama a `inventarioService.getDashboard()`, asigna los valores a los signals, maneja errores.

### Template

1. **Título** `<h1>Dashboard</h1>`
2. **Grid KPIs** — 3 columnas (`grid grid-cols-3 gap-4`):
   - Tarjeta "CATEGORÍAS": etiqueta gris small + número grande bold
   - Tarjeta "PRODUCTOS": igual estructura
   - Tarjeta "VALOR DEL INVENTARIO": valor en `text-indigo-600 font-bold text-2xl`, formateado como moneda `$ X.XXX,XX`
3. **Sección stock bajo**:
   - Encabezado: "Productos con stock bajo" + span "(menos de 5 unidades)" en gris
   - Si `cargando()`: spinner o skeleton
   - Si `productosStockBajo().length === 0`: tarjeta con borde, texto centrado gris "No hay productos con stock bajo"
   - Si hay productos: tabla con columnas Nombre, Categoría, Stock

---

## Estilos

- Sidebar: `bg-[#1e2330]`
- Link activo: `bg-indigo-600`
- Valor inventario: `text-indigo-600`
- Fondo main: `bg-gray-50`
- Tarjetas KPI: `bg-white border border-gray-200 rounded-lg p-6`
- Todo via Tailwind v4 (sin tailwind.config.js)

---

## Consideraciones

- `HttpClient` requiere `provideHttpClient()` en `app.config.ts`.
- La API usa HTTPS con certificado local; Angular debe ignorar errores SSL en desarrollo (el backend .NET usa `https://localhost:7123`).
- Los íconos del sidebar son SVGs inline simples (sin dependencia externa).
- El formateo de moneda usa `${{ valor | number:'1.2-2' }}` con separadores de miles manuales o `CurrencyPipe` con locale `es-AR`.

-Allways reply in spanish (code in spanish) even input english.
-Not use large (simplify) explanatory comments unless requested.
