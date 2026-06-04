import { Component, inject, signal } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { InventarioService } from '../../services/inventario.service';
import { CrearCategoriaModalComponent } from './crear-categoria-modal/crear-categoria-modal.component';
import { EditarCategoriaModel } from './editar-categoria-model/editar-categoria-model';

@Component({
  selector: 'app-categorias',
  imports: [CrearCategoriaModalComponent, EditarCategoriaModel],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent {
  private inventarioService = inject(InventarioService);

  categorias = signal<Categoria[]>([]);
  mostrarModal = signal(false);
  mostrarModalEditar = signal(false);
  categoriaSeleccionada = signal<Categoria | null>(null);

  constructor() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.inventarioService.getCategorias().subscribe(data => {
      this.categorias.set(data);
    });
  }

  crearCategoria() {
    this.mostrarModal.set(false);
    this.cargarCategorias();
  }

  editarCategoria(){
    this.mostrarModalEditar.set(false);
    this.cargarCategorias();
  }

  abrirEditar(cat: Categoria) {
  this.categoriaSeleccionada.set(cat);
  this.mostrarModalEditar.set(true);
}
}
