using Rumors.Desktop.Common.Messages;
using Rumors.Desktop.Common.Messages.MessageHub;
using System;
using System.Threading.Tasks;

namespace Ragatool.AddIn.MessageHandlers
{
    internal class ErrorMessageHandler : BaseMessageHandler<ErrorMessage>
    {
        protected override async Task<BaseMessage> Process(ErrorMessage message)
        { 
            return new SimpleResponseMessage
            {
                
            };
        }
    }
}
