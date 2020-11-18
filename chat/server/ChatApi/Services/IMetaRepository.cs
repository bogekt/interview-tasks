using System.Threading.Tasks;
using ChatApi.Models;

namespace ChatApi.Services
{
    public interface IMetaRepository
    {
        Task<Meta> LoadAsync();
        Task<Meta> IncrementCountAsync();
        Task<Meta> DecrementCountAsync();
    }
}