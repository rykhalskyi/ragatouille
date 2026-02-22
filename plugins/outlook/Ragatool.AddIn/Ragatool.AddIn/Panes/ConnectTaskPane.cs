using System;
using System.Windows.Forms;

namespace Ragatool.AddIn.Panes
{
    public partial class ConnectTaskPane : UserControl, IPaneUserControl
    {
        public ConnectTaskPane()
        {
            InitializeComponent();
        }

        public string Caption => "Ragatool Connector";

        public void OnPanelAdded()
        {
        }

        public void OnPanelOpened()
        {
            UpdateLabels();
        }

        private void UpdateLabels()
        {
            var connected = ThisAddIn.WebSocketClient.Connected;
            if (connected)
            {
                lbl_connect.Text = "Connected to Ragatool";
                btn_connect.Text = "Disconnect";
            }
            else
            {
                lbl_connect.Text = "Not connected to Ragatool";
                btn_connect.Text = "Connect";
            }
        }

        private async void btn_connect_Click(object sender, EventArgs e)
        {
            if (ThisAddIn.WebSocketClient.Connected)
            {
                await ThisAddIn.WebSocketClient.Disconnect();
                ThisAddIn.WebSocketClient.Dispose();
            }
            else
            {
                await ThisAddIn.WebSocketClient.Connect();
            }

            
            if (InvokeRequired)
            {
                BeginInvoke(new Action(UpdateLabels));
            }
            else
            {
                UpdateLabels();
            }
        }
    }
}
