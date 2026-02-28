using System.Threading.Tasks;

namespace Ragatool.AddIn.Panes
{
    public interface IPaneUserControl
    {
        string Caption { get; }
        void OnPanelAdded();
        void OnPanelOpened();
    }
}
