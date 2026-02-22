using Rumors.Desktop.Common.Messages;
using Rumors.Desktop.Common.Messages.Serialization;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Rumors.Desktop.Common.WebSocket
{
    public class WebSocketMessageSerializer : IMessageSerializer
    {
        private const string PingMessageType = "ping";
        private const string CallCommandMessageType = "call_command";
        private const string ErrorMessageType = "error";
        public BaseMessage Deserialize(string xml)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var webSocketMessage = JsonSerializer.Deserialize<WebSocketMessage>(xml, options);
            switch (webSocketMessage.Topic)
            {
                case PingMessageType:
                    return new PingMessage();
                case CallCommandMessageType:
                    return new CallCommandMessage() { 
                        CommandName = webSocketMessage.Id,
                        Arguments = webSocketMessage.Message,
                        CorrelationId = webSocketMessage.Correlation_id
                    };
                case ErrorMessageType:
                    return new ErrorMessage();
                default:
                    return new ErrorMessage(); ;
            }
        }

        public string Serialize(BaseMessage message)
        {
            //Just stups here for now, we will implement the actual serialization logic later
            switch (message)
            {
                case PingMessage pingMessage:
                    return JsonSerializer.Serialize(new WebSocketClientMessage { Type = PingMessageType, Payload = "" });
                case CallCommandMessage callCommandMessage:
                    return JsonSerializer.Serialize(new WebSocketClientMessage { Type = CallCommandMessageType, Payload = "" });
                case ErrorMessage errorMessage:
                    return JsonSerializer.Serialize(new WebSocketClientMessage { Type = ErrorMessageType, Payload = "" });
                default:
                    throw new ArgumentException($"Unknown message type: {message.GetType().Name}");
            }
        }
    }
}
