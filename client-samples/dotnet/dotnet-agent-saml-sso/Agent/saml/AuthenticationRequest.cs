using System;
using System.Xml.Linq;
using Kentor.AuthServices;
using Kentor.AuthServices.Saml2P;

namespace org.wso2.carbon.identity.agent.saml
{
    public class AuthenticationRequest : Saml2AuthenticationRequest
    {
        public static readonly Uri NameIDFormatPersistentUri = new Uri("urn:oasis:names:tc:SAML:2.0:nameid-format:persistent");
        public string ProtocolBinding { get; internal set; }

        public XElement BuildAuthnRequest ()
        {
            var x = new XElement(Saml2Namespaces.Saml2P + LocalName);

            x.Add(base.ToXNodes());
            x.Add(new XAttribute("ProtocolBinding", ProtocolBinding));           
            x.Add(new XAttribute("AssertionConsumerServiceURL", AssertionConsumerServiceUrl));

            if(AttributeConsumingServiceIndex != null)
                x.Add(new XAttribute("AttributeConsumingServiceIndex", AttributeConsumingServiceIndex));

            if (ForceAuthentication)
                x.Add(new XAttribute("ForceAuthn", ForceAuthentication));

            // NameID policy.
            XElement nameIDPolicy = new XElement(Saml2Namespaces.Saml2P + "NameIDPolicy");
            nameIDPolicy.Add(new XAttribute("Format", NameIDFormatPersistentUri));
            nameIDPolicy.Add(new XAttribute("SPNameQualifier","Issuer"));
            nameIDPolicy.Add(new XAttribute("AllowCreate", true));
            x.Add(nameIDPolicy);
            // End of nameid policy.

            if (RequestedAuthnContext != null && RequestedAuthnContext.ClassRef != null)
            {
                x.Add(new XElement(Saml2Namespaces.Saml2P + "RequestedAuthnContext",
                    new XAttribute("Comparison", RequestedAuthnContext.Comparison.ToString().ToLowerInvariant()),

                    // Add the classref as original string to avoid URL normalization
                    // and make sure the emitted value is exactly the configured.
                    new XElement(Saml2Namespaces.Saml2 + "AuthnContextClassRef",
                        RequestedAuthnContext.ClassRef.OriginalString)));
            }
            return x;
        }
    }
}