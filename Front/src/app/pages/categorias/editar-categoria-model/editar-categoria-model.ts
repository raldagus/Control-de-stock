import { Component, inject, output, signal, input, effect } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-editar-categoria-model',
  imports: [],
  templateUrl: './editar-categoria-model.html',
  styleUrl: './editar-categoria-model.css',
})
export class EditarCategoriaModel {
  private inventarioService = inject(InventarioService);

  nombre = signal('');
  descripcion = signal('');
  guardando = signal(false);
  errorNombre = signal(false);
  errorApi = signal(false);

  categoriaInput = input.required<Categoria>(); // ← recibe la categoría completa
  categoriaEditar = output<Categoria>();
  cerrar = output<void>();

  constructor() {
    effect(() => {
      const cat = this.categoriaInput();
      this.nombre.set(cat.nombre);
      this.descripcion.set(cat.descripcion ?? '');
    });
  }

  guardar() {
    if (!this.nombre().trim()) {
      this.errorNombre.set(true);
      return;
    }
    this.guardando.set(true);
    this.errorApi.set(false);
    this.inventarioService
      .editarCategoria(this.categoriaInput().idCategoria, { 
      nombre: this.nombre().trim(), 
      descripcion: this.descripcion() || null 
    })
      .subscribe({
        next: cat => {
          this.guardando.set(false);
          this.categoriaEditar.emit(cat);
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
