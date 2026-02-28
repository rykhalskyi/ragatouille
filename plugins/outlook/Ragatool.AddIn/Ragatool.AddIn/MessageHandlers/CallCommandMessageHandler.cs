using Rumors.Desktop.Common.Messages;
using Rumors.Desktop.Common.Messages.MessageHub;
using Rumors.Desktop.Common.WebSocket;
using System;
using System.Threading.Tasks;

namespace Ragatool.AddIn.MessageHandlers
{
    internal class CallCommandMessageHandler : BaseMessageHandler<CallCommandMessage>
    {
        protected override async Task<BaseMessage> Process(CallCommandMessage message)
        {
            var command = ThisAddIn.SupportedCommands.GetCommand(message.CommandName);
            if ( command != null)
            {
                var result = await command.Do(message.Arguments);

                var response = new WebSocketClientMessage
                {
                    Type = "command_response",
                    Payload = new CommandPayload
                    {
                        Success = true,
                        Message = result
                    },
                    Correlation_Id = message.CorrelationId
                };

                await ThisAddIn.WebSocketClient.Send(response.ToJsonString());
            }

            return new SimpleResponseMessage();
        }
    }
}
