import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly inventarioService = inject(InventarioService);
  private readonly destroyRef = inject(DestroyRef);

  totalCategorias = signal(0);
  totalProductos = signal(0);
  valorInventario = signal(0);
  productosStockBajo = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  valorInventarioFormateado = computed(() =>
    '$ ' + this.valorInventario().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );

  ngOnInit() {
    this.inventarioService.getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.totalCategorias.set(data.totalCategorias);
          this.totalProductos.set(data.totalProductos);
          this.valorInventario.set(data.valorInventario);
          this.productosStockBajo.set(data.productosStockBajo);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('Error al cargar los datos');
          this.cargando.set(false);
        },
      });
  }
}
