import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Categoria, CategoriaCrear } from '../models/categoria.model';
import { Producto, ProductoEditar } from '../models/producto.model';
import { Movimiento } from '../models/movimiento.model';

export interface DashboardData {
  totalCategorias: number;
  totalProductos: number;
  valorInventario: number;
  productosStockBajo: Producto[];
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://control-de-stock-ki5e.onrender.com/api';

  getDashboard(): Observable<DashboardData> {
    return forkJoin({
      categorias: this.http.get<Categoria[]>(`${this.baseUrl}/categorias`),
      productos: this.http.get<Producto[]>(`${this.baseUrl}/productos`),
    }).pipe(
      map(({ categorias, productos }) => ({
        totalCategorias: categorias.length,
        totalProductos: productos.length,
        valorInventario: productos.reduce((acc, p) => acc + p.precioUnitario * p.stock, 0),
        productosStockBajo: productos.filter(p => p.stock < 5),
      }))
    );
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`)
  }

  crearCategoria(data: CategoriaCrear): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/categorias`, data);
  }

  editarCategoria(id: number, data: CategoriaCrear): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/categorias/${id}`, data);
  }

  editarProducto(id: number, data: ProductoEditar): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}`, data);
  }

  crearProducto(data: ProductoEditar): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, data);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/productos/${id}`);
  }

  getMovimiento(): Observable<Movimiento[]>{
    return this.http.get<Movimiento[]>(`${this.baseUrl}/movimientos`)
  }

}
