using System.Web.Services;

namespace Sample2
{
    /// <summary>
    /// This is used to check if SLO has occured for the current app.
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)] 
    [System.Web.Script.Services.ScriptService]
    public class CheckSession : System.Web.Services.WebService
    {
        [WebMethod(EnableSession = true)]
        public string GetSessionValue()
        {
            if (Application["sloOccured"] != null) {
                if (Session["SessionIndex"].ToString() == Application["sloOccured"].ToString()) {
                    Session.Abandon();
                    return "true";
                }
                return "[slo] unintended SP.";
            }
            return "[slo] null";  
        }
    }
}
