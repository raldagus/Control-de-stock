import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { Producto, ProductoEditar } from '../../../models/producto.model';
import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-agregar-nuevo-producto-modal',
  imports: [],
  templateUrl: './agregar-nuevo-producto-modal.html',
  styleUrl: './agregar-nuevo-producto-modal.css',
})
export class AgregarNuevoProductoModal {
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
  categoriaNombre = signal('');
  errorCategoria = signal(false);
  stock = signal(0)

  productoCreado = output<Producto>();
  cerrar = output<void>();

  constructor() {
    this.inventarioService.getCategorias().subscribe(cats => this.categorias.set(cats));
  }

  guardar() {
    if (!this.idCategoria()) {
      this.errorCategoria.set(true);
      return;
    }
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
    const payload = {
      idCategoria: this.idCategoria(),
      nombre: this.nombre().trim(),
      descripcion: this.descripcion() || null,
      codigo: this.codigo() || this.generarCodigo(),  // autocomplete
      precioUnitario: this.precioUnitario(),
      stock: this.stock(),
      eliminado: false,
      
    };
    this.inventarioService.crearProducto(payload).subscribe({
      next: prod => {
        this.guardando.set(false);
        this.productoCreado.emit(prod);
      },
      error: () => {
        this.guardando.set(false);
        this.errorApi.set(true);
      },
    });
  }
  onCategoriaInput(valor: string) {
    this.categoriaNombre.set(valor);
    const cat = this.categorias().find(
      c => c.nombre.toLowerCase() === valor.toLowerCase()
    );
    if (cat) {
      this.idCategoria.set(cat.idCategoria);
      this.errorCategoria.set(false);
    } else {
      this.idCategoria.set(0);
    }
  }

  cancelar() {
    this.cerrar.emit();
  }

  generarCodigo(): string {
    const cat = this.categorias().find(c => c.idCategoria === this.idCategoria());
    const prefijo = cat ? cat.nombre.substring(0, 3).toUpperCase() : 'PRD';
    const random = crypto.randomUUID().split('-')[0].toUpperCase();
    return `${prefijo}-${random}`;
  }
}
