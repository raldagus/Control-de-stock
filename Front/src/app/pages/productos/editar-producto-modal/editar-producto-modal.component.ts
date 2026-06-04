import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { Producto, ProductoEditar } from '../../../models/producto.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-editar-producto-modal',
  imports: [],
  templateUrl: './editar-producto-modal.component.html',
  styleUrl: './editar-producto-modal.component.css',
})
export class EditarProductoModalComponent {
  private inventarioService = inject(InventarioService);

  nombre = signal('');
  descripcion = signal('');
  codigo = signal('');
  precioUnitario = signal(0);
  idCategoria = signal(0);
  categorias = signal<Categoria[]>([]);
  guardando = signal(false);
  errorNombre = signal(false);
  errorPrecio = signal(false);
  errorApi = signal(false);
  stock = signal(0);

  productoInput = input.required<Producto>();
  productoEditado = output<Producto>();
  cerrar = output<void>();
  

  constructor() {
    this.inventarioService.getCategorias().subscribe(cats => this.categorias.set(cats));

    effect(() => {
      const p = this.productoInput();
      this.nombre.set(p.nombre);
      this.descripcion.set(p.descripcion ?? '');
      this.codigo.set(p.codigo ?? '');
      this.precioUnitario.set(p.precioUnitario);
      this.idCategoria.set(p.idCategoria);
      this.stock.set(p.stock);
    });
  }

  guardar() {
    if (!this.nombre().trim()) {
      this.errorNombre.set(true);
      return;
    }
    if (this.precioUnitario() <= 0) {
      this.errorPrecio.set(true);
      return;
    }
    this.guardando.set(true);
    this.errorApi.set(false);
    const payload: ProductoEditar = {
      idCategoria: this.idCategoria(),
      nombre: this.nombre().trim(),
      descripcion: this.descripcion() || null,
      stock: this.stock(),
      codigo: this.codigo() || null,
      precioUnitario: this.precioUnitario(),
    };
    this.inventarioService.editarProducto(this.productoInput().idProducto, payload).subscribe({
      next: prod => {
        this.guardando.set(false);
        this.productoEditado.emit(prod);
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
