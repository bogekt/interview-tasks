using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatApi.Models;

namespace ChatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // POST: api/login
        [HttpPost]
        public ValueTask<bool> Post(User user)
        {
            if (string.IsNullOrWhiteSpace(user?.Name)) 
            {
                return new ValueTask<bool>(false);
            }

            #if DEBUG
                System.Diagnostics.Debug.WriteLine($"Loggined: {user.Name}");
            #endif

            return new ValueTask<bool>(true);
        }
    }
}