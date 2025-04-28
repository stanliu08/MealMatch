using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantsApi.Data;
using RestaurantsApi.Model;

namespace RestaurantsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RestaurantsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRestaurant([FromBody] Restaurant restaurant)
        {
            if (restaurant == null)
                return BadRequest("Invalid restaurant data.");

            // Check if restaurant already exists based on GooglePlaceId
            var existing = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.GooglePlaceId == restaurant.GooglePlaceId);

            if (existing != null)
                return Ok(existing); // Already exists

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return Ok(restaurant);
        }
    }
}
