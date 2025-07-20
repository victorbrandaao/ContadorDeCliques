# Use a imagem base do .NET 9 para runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Use a imagem do SDK para build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ContadorDeCliques.csproj", "."]
RUN dotnet restore "ContadorDeCliques.csproj"
COPY . .
RUN dotnet build "ContadorDeCliques.csproj" -c Release -o /app/build

# Publicar a aplicação
FROM build AS publish
RUN dotnet publish "ContadorDeCliques.csproj" -c Release -o /app/publish

# Imagem final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ContadorDeCliques.dll"]
