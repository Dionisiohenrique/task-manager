# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY TaskManager.Api.csproj ./
RUN dotnet restore TaskManager.Api.csproj

COPY . ./
RUN dotnet publish TaskManager.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Create directory for persistent SQLite database
RUN mkdir -p /app/data

ENV ASPNETCORE_URLS=http://+:5000 \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="Data Source=/app/data/taskmanager.db"

COPY --from=build /app/publish .

EXPOSE 5000
ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]
