# Control de Stock

Sistema web fullstack para la gestión de inventario. Permite administrar categorías, productos y movimientos de stock (entradas, salidas y ajustes), con un dashboard de métricas en tiempo real y alertas de stock bajo.

🔗 **Demo:** https://control-de-stock-omega.vercel.app
📖 **API (Swagger):** https://control-de-stock-ki5e.onrender.com/swagger

---

## Características

- **Gestión de categorías** — alta, edición y baja de categorías de productos.
- **Gestión de productos** — CRUD completo con código único, precio, stock y categoría asociada.
- **Movimientos de inventario** — registro automático de entradas, salidas y ajustes de stock.
- **Dashboard** — métricas en tiempo real: total de categorías, productos, valor del inventario y alertas de stock bajo.
- **Documentación de la API** — interfaz Swagger interactiva para explorar y probar los endpoints.

---

## Stack tecnológico

**Frontend**
- Angular 17+ (standalone components y signals)
- TypeScript
- RxJS

**Backend**
- .NET 9 Web API
- Entity Framework Core 9
- Swagger / OpenAPI

**Base de datos**
- PostgreSQL

**Infraestructura**
- Frontend desplegado en Vercel
- Backend dockerizado en Render
- Base de datos en Supabase
- CI/CD automático desde GitHub

---

## Arquitectura

El backend sigue una arquitectura por capas con separación de responsabilidades:

```
Controller  →  Service  →  Repository  →  DbContext  →  PostgreSQL
```

- **Controllers** — exponen los endpoints REST y manejan las peticiones HTTP.
- **Services** — contienen la lógica de negocio.
- **Repositories** — encapsulan el acceso a datos mediante Entity Framework Core.
- **DTOs** — separan los modelos de dominio de los datos expuestos por la API.

El frontend está organizado en módulos de funcionalidades (categorías, productos, movimientos), con un servicio HTTP central que se comunica con la API mediante el patrón de signals de Angular.

---

## Estructura del repositorio

```
Control-de-stock/
├── Back/      → API REST en .NET 9
└── Front/     → aplicación Angular
```

---

## Ejecución local

### Requisitos previos
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) y Angular CLI
- Una base de datos PostgreSQL (local o en Supabase)

### Backend

```bash
cd Back
dotnet restore
```

Configurá la cadena de conexión en `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "StockDB": "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=TU_PASSWORD"
  }
}
```

Aplicá las migraciones y levantá la API:

```bash
dotnet ef database update
dotnet run
```

La API queda disponible en `https://localhost:7123` y la documentación Swagger en `/swagger`.

### Frontend

```bash
cd Front
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

> ℹ️ La URL del backend se configura en `src/app/services/inventario.service.ts`.

---

## Despliegue

| Componente | Plataforma | Detalle |
|---|---|---|
| Frontend | Vercel | Build de Angular, output `dist/pagina-stock/browser` |
| Backend | Render | Servicio web dockerizado |
| Base de datos | Supabase | PostgreSQL con Session Pooler (IPv4) |

El despliegue es automático: cada push a la rama `main` dispara un nuevo build tanto en Vercel como en Render.

---

## Autor

**Agustina Leiva Daza** ([@raldagus](https://github.com/raldagus))
Catamarca, Argentina
