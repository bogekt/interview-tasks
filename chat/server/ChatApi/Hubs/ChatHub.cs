using ChatApi.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace ChatApi.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMetaRepository _metaRepository;

        public ChatHub(IMetaRepository metaRepository) => 
            _metaRepository = metaRepository;

        public async Task SendMessage(object message) =>
            await Clients.All.SendAsync(
                "ReceiveMessage", 
                new { type = "message", data = message }
            );

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.All.SendAsync(
                "ReceiveMessage",
                new { type = "meta", data = await _metaRepository.IncrementCountAsync() }
            );
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            await Clients.All.SendAsync(
                "ReceiveMessage",
                new { type = "meta", data = await _metaRepository.DecrementCountAsync() }
            );
        }
    }
}