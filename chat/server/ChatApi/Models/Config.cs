namespace ChatApi.Models
{
    public class Config
    {
        public string HubUrl => Consts.ChatHubUrl;
        public Meta Meta { get; set; }
    }
}