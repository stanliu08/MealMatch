using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantsApi.Data;
using RestaurantsApi.Model;

namespace RestaurantsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SaveFavorite([FromBody] FavoriteRestaurant favorite)
        {
            if (favorite == null)
                return BadRequest("Invalid favorite data.");

            _context.FavoriteRestaurants.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(favorite);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var favorite = await _context.FavoriteRestaurants.FindAsync(id);

            if (favorite == null)
                return NotFound();

            _context.FavoriteRestaurants.Remove(favorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
