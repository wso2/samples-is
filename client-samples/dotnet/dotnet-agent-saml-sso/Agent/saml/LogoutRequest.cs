using Kentor.AuthServices;
using Kentor.AuthServices.Saml2P;
using System.IdentityModel.Tokens;
using System.Web;
using System.Xml.Linq;

namespace Agent.saml
{
    class LogoutRequest : Saml2LogoutRequest
    {
        public XElement BuildRequest()
        {
            var x = new XElement(Saml2Namespaces.Saml2P + LocalName);

            x.Add(base.ToXNodes());

            // Set issuer.
            x.SetElementValue(Saml2Namespaces.Saml2 + "Issuer", Issuer.Id);
            // End of setting issuer.

            // Setting name Identifier. 
            Saml2Subject subject = (Saml2Subject)HttpContext.Current.Session["Saml2Subject"];

            XElement nameID = new XElement(Saml2Namespaces.Saml2 + "NameID", subject.NameId.Value);
            nameID.Add(new XAttribute("Format", subject.NameId.Format));
            x.Add(nameID);
            // End of setting name Identifier.

            x.SetElementValue(Saml2Namespaces.Saml2P + "SessionIndex", HttpContext.Current.Session["SessionIndex"]);
            return x;
        }   
    }
}
