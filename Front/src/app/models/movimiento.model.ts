export type TipoMovimiento = 'Entrada' | 'Salida' | 'Ajuste';

export interface Movimiento {
  idMovimiento: number;
  idProducto: number;
  nombreProducto: string;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  motivo?: string;
  fechaMovimiento: string;
}

export interface MovimientoCrear {
  idProducto: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  motivo?: string | null;
}
