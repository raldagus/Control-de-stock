using StockAPI.DTOs;

namespace StockAPI.Services.Interfaces;

public interface IProductoService
{
    Task<IEnumerable<ProductoResponseDto>> ObtenerTodosAsync(int? idCategoria = null);
    Task<ProductoResponseDto?> ObtenerPorIdAsync(int id);
    Task<ProductoResponseDto> AgregarAsync(ProductoCrearDto dto);
    Task<ProductoResponseDto?> ModificarAsync(int id, ProductoEditarDto dto);
    Task<bool> EliminarAsync(int id);
}
