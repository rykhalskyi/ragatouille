namespace Ragatool.AddIn.Panes
{
    partial class ConnectTaskPane
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btn_connect = new System.Windows.Forms.Button();
            this.lbl_connect = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btn_connect
            // 
            this.btn_connect.Location = new System.Drawing.Point(23, 61);
            this.btn_connect.Name = "btn_connect";
            this.btn_connect.Size = new System.Drawing.Size(75, 23);
            this.btn_connect.TabIndex = 0;
            this.btn_connect.Text = "button1";
            this.btn_connect.UseVisualStyleBackColor = true;
            this.btn_connect.Click += new System.EventHandler(this.btn_connect_Click);
            // 
            // lbl_connect
            // 
            this.lbl_connect.AutoSize = true;
            this.lbl_connect.Location = new System.Drawing.Point(21, 28);
            this.lbl_connect.Name = "lbl_connect";
            this.lbl_connect.Size = new System.Drawing.Size(44, 16);
            this.lbl_connect.TabIndex = 1;
            this.lbl_connect.Text = "label1";
            // 
            // ConnectTaskPane
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.lbl_connect);
            this.Controls.Add(this.btn_connect);
            this.Name = "ConnectTaskPane";
            this.Size = new System.Drawing.Size(234, 182);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btn_connect;
        private System.Windows.Forms.Label lbl_connect;
    }
}
