using Microsoft.Extensions.Options;
using Rumors.Desktop.Common.Messages;
using Rumors.Desktop.Common.Messages.MessageHub;
using Rumors.Desktop.Common.WebSocket;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ragatool.AddIn.MessageHandlers
{
    internal class PingMessageHandler : BaseMessageHandler<PingMessage>
    {
        protected override async Task<BaseMessage> Process(PingMessage message)
        {
            var commands = ThisAddIn.SupportedCommands.CommandsAsJson("Outlook emails");
            var response = new WebSocketClientMessage
            {
                Type = "pong",
                Payload = commands,
            };

            await ThisAddIn.WebSocketClient.Send(response.ToJsonString());
            
            return new SimpleResponseMessage
            {
            };
        }
    }
}
