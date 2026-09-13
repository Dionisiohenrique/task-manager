using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.Priority).HasConversion<string>();
        });

        // Seed initial data
        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem
            {
                Id = 1,
                Title = "Set up Project Architecture",
                Description = "Configure Angular 19+ standalone frontend with ASP.NET Core Web API backend and EF Core InMemory database.",
                Status = TaskItemStatus.Completed,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Id = 2,
                Title = "Implement Angular Signals State",
                Description = "Leverage Angular Signals, computed values, and reactive forms for seamless task management dashboard.",
                Status = TaskItemStatus.InProgress,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(2),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = null
            },
            new TaskItem
            {
                Id = 3,
                Title = "Design Accessible Task Modal Dialog",
                Description = "Use modern HTML5 native dialog element with backdrop and keyboard navigation for adding and editing tasks.",
                Status = TaskItemStatus.InProgress,
                Priority = TaskPriority.Medium,
                DueDate = DateTime.UtcNow.AddDays(3),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = null
            },
            new TaskItem
            {
                Id = 4,
                Title = "CORS and API Service Integration",
                Description = "Enable CORS on ASP.NET Core API and connect Angular HttpClient service with typed endpoints.",
                Status = TaskItemStatus.Todo,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = null
            },
            new TaskItem
            {
                Id = 5,
                Title = "Export Tasks and Metrics Summary",
                Description = "Generate productivity reports, status distribution charts, and export tasks to JSON format.",
                Status = TaskItemStatus.Todo,
                Priority = TaskPriority.Low,
                DueDate = DateTime.UtcNow.AddDays(10),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = null
            }
        );
    }
}
