import { Component, inject, signal } from '@angular/core';
import { Movimiento, TipoMovimiento } from '../../models/movimiento.model';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-movimientos',
  imports: [],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css',
})
export class MovimientosComponent {
  readonly movimientos = signal<Movimiento[]>([]);
  private inventarioService = inject(InventarioService);

  badgeClases(tipo: TipoMovimiento): string {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    if (tipo === 'Entrada') return `${base} bg-green-100 text-green-700`;
    if (tipo === 'Salida') return `${base} bg-red-100 text-red-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  }

   constructor() {
    this.obtenerMovimientos();
  }
  obtenerMovimientos() {
    this.inventarioService.getMovimiento().subscribe(data => this.movimientos.set(data));
  }
}
