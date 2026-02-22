namespace Rumors.Desktop.Common.WebSocket
{
    public class WebSocketMessage
    {
        public string Id { get; set; }
        public string Timestamp { get; set; }
        public string Topic { get; set; }
        public string Message { get; set; }
        public object Payload { get; set; }
        public string CollectionId { get; set; }
        public string Correlation_id { get; set; }
    }
}
