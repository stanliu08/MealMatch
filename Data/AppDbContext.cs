using Microsoft.EntityFrameworkCore;
using RestaurantsApi.Model;
using System.Collections.Generic;

namespace RestaurantsApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<FavoriteRestaurant> FavoriteRestaurants { get; set; }

        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Only used during migrations
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=restaurants;Username=postgres;Password=password123");
            }
        }
    }
}
