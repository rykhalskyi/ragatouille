namespace Rumors.Desktop.Common.WebSocket
{
    public class WebSocketClientMessage
    {
        public string Type { get; set; }
        public object Payload { get; set; }
        public string Correlation_Id { get; set; }

    }
}
