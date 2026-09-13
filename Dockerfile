# ===================================================================
# Stage 1: Build Angular Frontend
# ===================================================================
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/task-manager-ui/package*.json ./
RUN npm ci

COPY frontend/task-manager-ui/ ./
RUN npm run build -- --configuration production

# ===================================================================
# Stage 2: Build C# .NET API with Embedded Frontend
# ===================================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

COPY backend/TaskManager.Api/TaskManager.Api.csproj ./backend/TaskManager.Api/
RUN dotnet restore ./backend/TaskManager.Api/TaskManager.Api.csproj

COPY backend/TaskManager.Api/ ./backend/TaskManager.Api/
WORKDIR /src/backend/TaskManager.Api

# Copy compiled Angular browser artifacts into .NET wwwroot directory
COPY --from=frontend-build /app/frontend/dist/task-manager-ui/browser ./wwwroot

RUN dotnet publish TaskManager.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===================================================================
# Stage 3: Lightweight Production Runtime
# ===================================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Ensure SQLite data directory exists
RUN mkdir -p /app/data

ENV ASPNETCORE_URLS=http://+:5000 \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="Data Source=/app/data/taskmanager.db"

COPY --from=backend-build /app/publish .

EXPOSE 5000
ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]
