using Microsoft.Office.Tools;
using System;

namespace Ragatool.AddIn.Panes
{
    public class TaskPane
    {
        public Type Type { get; set; }
        public CustomTaskPane Pane { get; set; }
    }
}
