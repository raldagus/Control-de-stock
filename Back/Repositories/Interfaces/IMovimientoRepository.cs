using StockAPI.Models;

namespace StockAPI.Repositories.Interfaces;

public interface IMovimientoRepository
{
    Task<IEnumerable<MovimientoStock>> ObtenerTodosAsync(int? idProducto = null);
    Task<MovimientoStock?> ObtenerPorIdAsync(int id);
    Task<MovimientoStock> RegistrarAsync(MovimientoStock movimiento);
}
