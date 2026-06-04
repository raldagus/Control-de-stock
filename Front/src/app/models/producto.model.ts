export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string | null;
  codigo?: string | null;
  precioUnitario: number;
  stock: number;
  idCategoria: number;
  nombreCategoria: string;
}

export interface ProductoCrear {
  idCategoria: number;
  nombre: string;
  descripcion?: string | null;
  codigo?: string | null;
  precioUnitario: number;
  stock: number;
}

export interface ProductoEditar {
  idCategoria: number;
  nombre: string;
  descripcion?: string | null;
  codigo?: string | null;
  stock: number;
  precioUnitario: number;
}
