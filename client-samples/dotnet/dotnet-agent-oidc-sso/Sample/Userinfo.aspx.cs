using System;

namespace Sample
{
    public partial class Userinfo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            rpIFrame.Attributes.Add("src", "rpIFrame.aspx");
        }
    }
}