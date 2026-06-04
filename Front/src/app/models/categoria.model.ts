export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaCrear {
  nombre: string;
  descripcion?: string | null;
}
