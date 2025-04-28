namespace RestaurantsApi.Model
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string GooglePlaceId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public string MainPicturePath { get; set; }
        public double? Rating { get; set; }
        public string OpeningHours { get; set; }

    }
}
