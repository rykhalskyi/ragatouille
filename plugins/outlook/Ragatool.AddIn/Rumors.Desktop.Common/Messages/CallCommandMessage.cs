namespace Rumors.Desktop.Common.Messages
{
    public class CallCommandMessage : BaseMessage
    {
        public string CommandName { get; set; }
        public string Arguments { get; set; }
        public string CorrelationId { get; set; }
    }
}
