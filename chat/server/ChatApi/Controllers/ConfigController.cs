using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatApi.Models;
using ChatApi.Services;

namespace ChatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly IMetaRepository _metaRepository;

        public ConfigController(IMetaRepository metaRepository) => 
            _metaRepository = metaRepository;

        // get: api/config
        [HttpGet]
        public async Task<Config> Get() => new Config 
        { 
            Meta =  await _metaRepository.LoadAsync() 
        };
    }
}