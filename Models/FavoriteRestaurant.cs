namespace RestaurantsApi.Model
{
    public class FavoriteRestaurant
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
}
