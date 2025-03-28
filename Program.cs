using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyRestaurantApp
{
    public class Restaurant
    {
        public string? title { get; set; }
        public string? description { get; set; }
    }

    public class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Searching for mock 'restaurant' data...\n");

            using HttpClient client = new HttpClient();

            // ✅ Placeholder API 
            string apiUrl = "https://api.sampleapis.com/coffee/hot";

            try
            {
                HttpResponseMessage response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    string jsonData = await response.Content.ReadAsStringAsync();

                    Console.WriteLine("Raw JSON Response:\n");
                    Console.WriteLine(jsonData);

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    var restaurants = JsonSerializer.Deserialize<List<Restaurant>>(jsonData, options);

                    if (restaurants != null && restaurants.Count > 0)
                    {
                        Console.WriteLine($"\n Found {restaurants.Count} mock entries:\n");

                        foreach (var r in restaurants)
                        {
                            Console.WriteLine($"Name: {r.title}");
                            Console.WriteLine($"Description: {r.description}");
                            Console.WriteLine(new string('-', 30));
                        }
                    }
                    else
                    {
                        Console.WriteLine("No entries found.");
                    }
                }
                else
                {
                    Console.WriteLine($"API call failed: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching data: {ex.Message}");
            }
        }
    }
}
