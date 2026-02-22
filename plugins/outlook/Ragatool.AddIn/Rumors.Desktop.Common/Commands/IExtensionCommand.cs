using System.Threading.Tasks;

namespace Ragatool.AddIn.Commands
{
    public interface IExtensionCommand
    {
        string Name { get; }
        string Description { get; }
        string Input { get; }
        string App { get; }
        string Entity { get; set; }

        Task<string> Do(string arguments);
    }
}
