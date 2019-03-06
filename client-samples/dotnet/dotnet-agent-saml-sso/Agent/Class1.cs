using System.Web;
using System.Web.SessionState;

namespace agent
{
    public class Class1 : IRequiresSessionState
    {
        public Class1() { }

        public object GetSession(string key)
        {
            object session = HttpContext.Current.Session[key];
            return session;
        }
        public void SetSession(object data, string key)
        {
            HttpContext.Current.Session[key] =  data;
        }

        public string Test(string sessionKey)
        {

            string ss = GetSession(sessionKey).ToString();
            return ss + " from ClassLibrary1";
        }

    }
}