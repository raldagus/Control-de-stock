using Microsoft.EntityFrameworkCore;
using StockAPI.Models;

namespace StockAPI.Data;

public class StockDbContext : DbContext
{
    public StockDbContext(DbContextOptions<StockDbContext> options) : base(options) { }

    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<MovimientoStock> MovimientosStock => Set<MovimientoStock>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Categoria ──────────────────────────────────────────────
        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("Categorias");
            e.HasKey(c => c.IdCategoria);
            e.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
            e.Property(c => c.Descripcion).HasMaxLength(255);
            e.HasIndex(c => c.Nombre).IsUnique();
        });

        // ── Producto ───────────────────────────────────────────────
        modelBuilder.Entity<Producto>(e =>
        {
            e.ToTable("Productos");
            e.HasKey(p => p.IdProducto);
            e.Property(p => p.Nombre).IsRequired().HasMaxLength(150);
            e.Property(p => p.Descripcion).HasMaxLength(500);
            e.Property(p => p.Codigo).HasMaxLength(50);
            e.Property(p => p.PrecioUnitario).HasPrecision(10, 2);
            e.HasIndex(p => p.Codigo).IsUnique();

            e.HasOne(p => p.Categoria)
             .WithMany(c => c.Productos)
             .HasForeignKey(p => p.IdCategoria)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── MovimientoStock ────────────────────────────────────────
        modelBuilder.Entity<MovimientoStock>(e =>
        {
            e.ToTable("MovimientosStock");
            e.HasKey(m => m.IdMovimiento);
            e.Property(m => m.TipoMovimiento).IsRequired().HasMaxLength(20);
            e.Property(m => m.PrecioUnitario).HasPrecision(10, 2);
            e.Property(m => m.Motivo).HasMaxLength(255);

            e.HasOne(m => m.Producto)
             .WithMany(p => p.Movimientos)
             .HasForeignKey(m => m.IdProducto)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
