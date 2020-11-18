using System.Configuration;
using System.Threading.Tasks;
using ChatApi.Exceptions;
using ChatApi.Extensions;
using ChatApi.Models;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace ChatApi.Services
{
    public class StackExchangeRedisMetaRepository : IMetaRepository
    {
        private const string META_KEY = "COUNT";

        // !important: don't modify manually
        // According to https://stackexchange.github.io/StackExchange.Redis/Basics
        // we must init single ConnectionMultiplexer instance and reuse it
        // To do this achieve we use DLC technique (same as with HttpClient).
        // More about multiplexer https://stackexchange.github.io/StackExchange.Redis/PipelinesMultiplexers#multiplexing
        private static volatile ConnectionMultiplexer _connectionMultiplexer;
        private static readonly object _locker = new object();

        private readonly string _connectionString;

        public StackExchangeRedisMetaRepository(IConfiguration configuration) {

            if (string.IsNullOrWhiteSpace(configuration[Consts.RedisConnectionStringKey]))
                throw new InvalidConfigurationException($"{Consts.RedisConnectionStringKey} is empty");
            
            _connectionString = configuration[Consts.RedisConnectionStringKey];
        }

        public async Task<Meta> LoadAsync()
        {
            int.TryParse(
                await GetInstance().StringGetAsync(META_KEY).ConfigureAwait(false),
                out int count
            );

            return new Meta { Count = count };
        }

        public async Task<Meta> IncrementCountAsync() => new Meta 
        {
            Count = (int)(await GetInstance().StringIncrementAsync("").ConfigureAwait(false)), 
        };

        public async Task<Meta> DecrementCountAsync() => new Meta 
        {
            Count = (int)(await GetInstance().StringDecrementAsync("").ConfigureAwait(false)), 
        };

        private IDatabase GetInstance(int db = -1, object asyncState = null)
        {
            if (_connectionMultiplexer != null)
            {
                return _connectionMultiplexer.GetDatabase(db, asyncState);
            }

            return SingletonExtensions.TryCreateSingleton<ConnectionMultiplexer>(
                ref _connectionMultiplexer,
                _locker,
                () => ConnectionMultiplexer.Connect(_connectionString)
            ).GetDatabase(db, asyncState);
        }
    }
}