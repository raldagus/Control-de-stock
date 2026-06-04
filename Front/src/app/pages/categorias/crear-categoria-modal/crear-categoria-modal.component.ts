import { Component, inject, output, signal } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-crear-categoria-modal',
  imports: [],
  templateUrl: './crear-categoria-modal.component.html',
  styleUrl: './crear-categoria-modal.component.css',
})
export class CrearCategoriaModalComponent {
  private inventarioService = inject(InventarioService);

  nombre = signal('');
  descripcion = signal('');
  guardando = signal(false);
  errorNombre = signal(false);
  errorApi = signal(false);

  categoriaCreada = output<Categoria>();
  cerrar = output<void>();

  guardar() {
    if (!this.nombre().trim()) {
      this.errorNombre.set(true);
      return;
    }
    this.guardando.set(true);
    this.errorApi.set(false);
    this.inventarioService
      .crearCategoria({ nombre: this.nombre().trim(), descripcion: this.descripcion() || null })
      .subscribe({
        next: cat => {
          this.guardando.set(false);
          this.categoriaCreada.emit(cat);
        },
        error: () => {
          this.guardando.set(false);
          this.errorApi.set(true);
        },
      });
  }

  cancelar() {
    this.cerrar.emit();
  }
}
