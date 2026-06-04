namespace StockAPI.DTOs;

public record ProductoResponseDto(
    int IdProducto,
    string Nombre,
    string? Descripcion,
    string? Codigo,
    decimal PrecioUnitario,
    int Stock,
    int IdCategoria,
    string NombreCategoria
);

public record ProductoCrearDto(
    int IdCategoria,
    string Nombre,
    string? Descripcion,
    string? Codigo,
    decimal PrecioUnitario,
    int Stock
);

public record ProductoEditarDto(
    int IdCategoria,
    string Nombre,
    string? Descripcion,
    string? Codigo,
    decimal PrecioUnitario,
    int Stock

);
