using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Configurar Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("Redis") ?? "redis:6379";
    return ConnectionMultiplexer.Connect(connectionString);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Servir arquivos estáticos
app.UseDefaultFiles();
app.UseStaticFiles();

// Endpoint para incrementar contador
app.MapPost("/api/contador/incrementar", async (IConnectionMultiplexer redis) =>
{
    var db = redis.GetDatabase();
    var novoValor = await db.StringIncrementAsync("contador");
    return Results.Ok(new { contador = novoValor });
});

// Endpoint para obter contador atual
app.MapGet("/api/contador", async (IConnectionMultiplexer redis) =>
{
    var db = redis.GetDatabase();
    var valor = await db.StringGetAsync("contador");
    return Results.Ok(new { contador = valor.HasValue ? (long)valor : 0 });
});

// Endpoint para resetar contador
app.MapDelete("/api/contador", async (IConnectionMultiplexer redis) =>
{
    var db = redis.GetDatabase();
    await db.KeyDeleteAsync("contador");
    return Results.Ok(new { contador = 0, mensagem = "Contador resetado!" });
});

app.Run();