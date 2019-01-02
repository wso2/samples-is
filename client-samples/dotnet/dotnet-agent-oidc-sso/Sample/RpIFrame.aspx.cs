using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Sample
{
    public partial class RpIFrame : System.Web.UI.Page
    {
        public string SessionState { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            //SessionState = HttpContext.Current.Session["session_state"].toString();
        }
    }
}