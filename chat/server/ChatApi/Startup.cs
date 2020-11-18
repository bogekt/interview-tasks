using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SignalR;
using ChatApi.Hubs;
using ChatApi.Services;
using Microsoft.Net.Http.Headers;

namespace ChatApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            DI(services);

            services.AddRazorPages();
            services.AddCors(
                options => options.AddDefaultPolicy(
                    builder => builder
                        .WithOrigins(Configuration.GetSection(Consts.CorsKey).Get<string[]>())
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .WithHeaders(HeaderNames.ContentType, "X-Requested-With")
                        .AllowCredentials()
                )
            );
            ISignalRServerBuilder signalRBuilder = services
                .AddSignalR()
                .AddMessagePackProtocol();

            if (string.IsNullOrWhiteSpace(Configuration[Consts.RedisConnectionStringKey])) 
                return;

            signalRBuilder.AddStackExchangeRedis(
                Configuration[Consts.RedisConnectionStringKey], 
                options => options.Configuration.ChannelPrefix = Consts.Name
            );
        }

        private void DI(IServiceCollection services)
        {
            services.AddScoped<IMetaRepository, StackExchangeRedisMetaRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>(Consts.ChatHubUrl);
            });
        }
    }
}
