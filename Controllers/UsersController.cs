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
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (user == null)
                return BadRequest("Invalid user data.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpGet("{userId}/favorites")]
        public async Task<IActionResult> GetUserFavorites(int userId)
        {
            var favorites = await _context.FavoriteRestaurants
                .Where(f => f.UserId == userId)
                .ToListAsync();

            return Ok(favorites);
        }
    }
}
