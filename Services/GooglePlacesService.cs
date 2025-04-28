using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace RestaurantsApi.Services
{
    public class GooglePlacesService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public GooglePlacesService(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public async Task<GooglePlaceDetails?> GetPlaceDetails(string placeId)
        {
            string apiKey = _configuration["GoogleApiKey"];
            string url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={apiKey}";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var placeResult = JsonSerializer.Deserialize<GooglePlaceResult>(json);

            return placeResult?.Result;
        }
    }

    public class GooglePlaceResult
    {
        public GooglePlaceDetails Result { get; set; }
    }

    public class GooglePlaceDetails
    {
        public string Name { get; set; }
        public string Vicinity { get; set; }
    }
}
