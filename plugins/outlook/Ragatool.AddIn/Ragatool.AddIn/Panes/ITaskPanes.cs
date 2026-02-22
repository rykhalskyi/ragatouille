using Microsoft.Office.Tools;
using System.Windows.Forms;

namespace Ragatool.AddIn.Panes
{
    public interface ITaskPanes
    {
        CustomTaskPane TogglePane<T>() where T : UserControl;
    }
}
