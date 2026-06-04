import { Component, output } from '@angular/core';

@Component({
  selector: 'app-eliminar-producto-modal',
  imports: [],
  templateUrl: './eliminar-producto-modal.html',
  styleUrl: './eliminar-producto-modal.css',
})
export class EliminarProductoModal {
  cerrar = output<void>();
  confirmar = output<void>();

  confirmarEliminar() {
    this.confirmar.emit();
  }
  cancelar() {
    this.cerrar.emit();
  }
}