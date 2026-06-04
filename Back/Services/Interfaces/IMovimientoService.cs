using StockAPI.DTOs;

namespace StockAPI.Services.Interfaces;

public interface IMovimientoService
{
    Task<IEnumerable<MovimientoResponseDto>> ObtenerTodosAsync(int? idProducto = null);
    Task<MovimientoResponseDto?> ObtenerPorIdAsync(int id);
}
