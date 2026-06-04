import { Component, inject, signal, computed } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { InventarioService } from '../../services/inventario.service';
import { EditarProductoModalComponent } from './editar-producto-modal/editar-producto-modal.component';
import { AgregarNuevoProductoModal } from "./agregar-nuevo-producto-modal/agregar-nuevo-producto-modal";
import { EliminarProductoModal } from "./eliminar-producto-modal/eliminar-producto-modal";

@Component({
  selector: 'app-productos',
  imports: [EditarProductoModalComponent, AgregarNuevoProductoModal, EliminarProductoModal],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent {
  private inventarioService = inject(InventarioService);

  productos = signal<Producto[]>([]);
  mostrarModalEditar = signal(false);
  mostrarModal = signal(false);
  productoSeleccionado = signal<Producto | null>(null);
  filtroCategoria = signal('');
  eliminarModal = signal(false);
  productoAEliminar = signal<Producto | null>(null);

  productosFiltrados = computed(() => {
    const filtro = this.filtroCategoria().toLowerCase().trim();
    if (!filtro) return this.productos();
    return this.productos().filter(p =>
      p.nombreCategoria?.toLowerCase().includes(filtro)
    );
  });

  constructor() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.inventarioService.getProductos().subscribe(data => this.productos.set(data));
  }

  abrirEditar(prod: Producto) {
    this.productoSeleccionado.set(prod);
    this.mostrarModalEditar.set(true);
  }


  onProductoEditado() {
    this.mostrarModalEditar.set(false);
    this.cargarProductos();
  }

  onCrearProducto() {
    this.mostrarModal.set(false);
    this.cargarProductos();
  }

  abrirEliminar(prod: Producto) {
    this.productoAEliminar.set(prod);
    this.eliminarModal.set(true);
  }

  onConfirmarEliminar() {
  const prod = this.productoAEliminar();
  if (!prod) return;
  this.inventarioService.eliminarProducto(prod.idProducto).subscribe(() => {
    this.eliminarModal.set(false);
    this.productoAEliminar.set(null);
    this.cargarProductos();
  });
}

}
