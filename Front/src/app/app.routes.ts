import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { MovimientosComponent } from './pages/movimientos/movimientos.component';
import { ProductosComponent } from './pages/productos/productos.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'productos', component: ProductosComponent }

    ],
  },
];
