namespace Rumors.Desktop.Common.WebSocket
{
    public static class WebSocketClientMessageExtension
    {
        public static string ToJsonString(this WebSocketClientMessage message)
        {
            var options = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.SnakeCaseLower,
            };
            return System.Text.Json.JsonSerializer.Serialize(message, options);
        }
    }
}
