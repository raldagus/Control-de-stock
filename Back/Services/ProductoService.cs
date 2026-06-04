using StockAPI.DTOs;
using StockAPI.Models;
using StockAPI.Repositories.Interfaces;
using StockAPI.Services.Interfaces;

namespace StockAPI.Services;

public class ProductoService : IProductoService
{
    private readonly IProductoRepository _repo;
    private readonly ICategoriaRepository _categoriaRepo;

    public ProductoService(IProductoRepository repo, ICategoriaRepository categoriaRepo)
    {
        _repo = repo;
        _categoriaRepo = categoriaRepo;
    }

    public async Task<IEnumerable<ProductoResponseDto>> ObtenerTodosAsync(int? idCategoria = null)
    {
        var productos = await _repo.ObtenerTodosAsync(idCategoria);
        return productos.Select(ToDto);
    }

    public async Task<ProductoResponseDto?> ObtenerPorIdAsync(int id)
    {
        var producto = await _repo.ObtenerPorIdAsync(id);
        return producto is null ? null : ToDto(producto);
    }

    public async Task<ProductoResponseDto> AgregarAsync(ProductoCrearDto dto)
    {
        var categoria = await _categoriaRepo.ObtenerPorIdAsync(dto.IdCategoria)
            ?? throw new InvalidOperationException("La categoría indicada no existe.");

        var producto = new Producto
        {
            IdCategoria = dto.IdCategoria,
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Codigo = dto.Codigo,
            PrecioUnitario = dto.PrecioUnitario,
            Stock = dto.Stock
        };

        var resultado = await _repo.AgregarAsync(producto);
        resultado.Categoria = categoria;
        return ToDto(resultado);
    }

    public async Task<ProductoResponseDto?> ModificarAsync(int id, ProductoEditarDto dto)
    {
        var producto = await _repo.ObtenerPorIdAsync(id);
        if (producto is null) return null;

        var categoria = await _categoriaRepo.ObtenerPorIdAsync(dto.IdCategoria)
            ?? throw new InvalidOperationException("La categoría indicada no existe.");

        producto.Nombre = dto.Nombre;
        producto.Descripcion = dto.Descripcion;
        producto.Codigo = dto.Codigo;
        producto.PrecioUnitario = dto.PrecioUnitario;
        producto.IdCategoria = dto.IdCategoria;
        producto.Stock = dto.Stock;

        var resultado = await _repo.ModificarAsync(producto);
        resultado.Categoria = categoria;
        return ToDto(resultado);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _repo.EliminarAsync(id);

    private static ProductoResponseDto ToDto(Producto p) =>
        new(p.IdProducto, p.Nombre, p.Descripcion, p.Codigo,
            p.PrecioUnitario, p.Stock, p.IdCategoria, p.Categoria.Nombre);
}
