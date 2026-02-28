using Ragatool.AddIn.Commands;
using System.Collections.Generic;
using System.Linq;

namespace Rumors.Desktop.Common.Commands
{
    public class SupportedCommands
    {
        public List<IExtensionCommand> Commands { get; } = new List<IExtensionCommand>()
        {
           new GetAllAccountsCommand()
        };

        public IEnumerable<IExtensionCommand> CommandsAsJson(string entityName)
        {
            var commandsInfo = new List<object>();
            var result = Commands.ToList();
            result.ForEach(i => i.Entity = entityName);

            return result.ToList();
        }

        public IExtensionCommand GetCommand(string name)
        {
            return Commands.FirstOrDefault(i => i.Name == name);
        }
    }
}
