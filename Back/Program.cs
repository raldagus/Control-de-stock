using Microsoft.EntityFrameworkCore;
using StockAPI.Data;
using StockAPI.Repositories;
using StockAPI.Repositories.Interfaces;
using StockAPI.Services;
using StockAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// ── Base de datos ──────────────────────────────────────────────
builder.Services.AddDbContext<StockDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("StockDB")));

// ── Repositorios ───────────────────────────────────────────────
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IMovimientoRepository, MovimientoRepository>();

// ── Servicios ──────────────────────────────────────────────────
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IMovimientoService, MovimientoService>();

// ── Controllers + Swagger ──────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Stock API",
        Version = "v1",
        Description = "API para gestión de stock — Categorías, Productos y Movimientos"
    });

    // Incluir comentarios XML en Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);
});

// ── CORS (para Angular) ────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins(
           "http://localhost:4200",
           "https://control-de-stock-omega.vercel.app"
       )
       .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
var app = builder.Build();

// ── Middleware ─────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Stock API v1"));
}
app.UseCors("PermitirAngular");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
