using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Metadata;
using System.IO;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Xml;
using System.IdentityModel.Tokens;
using System.IdentityModel.Selectors;
using System.ServiceModel.Security;
using System.Xml.Linq;
using System.Web.SessionState;
using Kentor.AuthServices;
using Kentor.AuthServices.Saml2P;
using Agent;
using Agent.util;
using Agent.exceptions;
using Agent.saml;
using Agent.Security;

namespace org.wso2.carbon.identity.agent.saml
{
    public class SAML2SSOManager : IRequiresSessionState
    {
        SSOAgentConfig ssoAgentConfig = null;

        public SAML2SSOManager(SSOAgentConfig ssoAgentConfig)
        {
            this.ssoAgentConfig = ssoAgentConfig;
        }

        public String BuildRedirectBindingLoginRequest()
        {
            AuthenticationRequest samlRequest = new AuthenticationRequest();
            InitializeAuthnRequestProperties(samlRequest);

            // Buid basic saml request.
            String samlRequestString = "SAMLRequest=" + EncodeSamlRequest(samlRequest.BuildAuthnRequest().ToString());

            if (ssoAgentConfig.Saml2.IsRequestSigned)
            {
                X509Certificate2 cert = LoadX509Certificate();
                String signedRequest = DoSignRedirectRequest(samlRequestString, cert);

                return string.Concat(ssoAgentConfig.Saml2.IdPURL, "?", signedRequest);
            }
            else return string.Concat(ssoAgentConfig.Saml2.IdPURL, "?", samlRequestString);
        }

        internal void ProcessSAMLRequest(HttpContext context)
        {
            string samlRequest = context.Request.Params[SSOAgentConstants.SAML2SSO.HTTP_POST_PARAM_SAML2_AUTH_REQ];
            XmlElement sessionIndexElement = null;

            if (samlRequest != null)
            {
                string decodedSAMLRequest = Encoding.UTF8.GetString(Convert.FromBase64String(samlRequest));

                XmlDocument xmlDoc = new XmlDocument { PreserveWhitespace = true };
                xmlDoc.LoadXml(decodedSAMLRequest);

                XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDoc.NameTable);
                nsManager.AddNamespace("saml2p", "urn:oasis:names:tc:SAML:2.0:protocol");

                if (xmlDoc.DocumentElement.SelectSingleNode("saml2p:SessionIndex", nsManager) != null)
                {
                    sessionIndexElement = (XmlElement)xmlDoc.DocumentElement.SelectSingleNode("saml2p:SessionIndex", nsManager);
                }

                context.Application["sloOccured"] = sessionIndexElement.InnerText;
            }
        }

        private void InitializeAuthnRequestProperties(AuthenticationRequest samlRequest)
        {
            samlRequest.AssertionConsumerServiceUrl = new Uri(ssoAgentConfig.Saml2.ACSURL);
            samlRequest.DestinationUrl = new Uri(ssoAgentConfig.Saml2.IdPURL);
            samlRequest.ForceAuthentication = ssoAgentConfig.Saml2.IsForceAuthn;
            samlRequest.Issuer = new EntityId(ssoAgentConfig.Saml2.SPEntityId);
            samlRequest.ProtocolBinding = ssoAgentConfig.Saml2.HttpBinding;
            
            if (Int32.TryParse(ssoAgentConfig.Saml2.AttributeConsumingServiceIndex, out int attributeConsumingServiceIndex))       
                samlRequest.AttributeConsumingServiceIndex = attributeConsumingServiceIndex;           

            Saml2NameIdPolicy nameIdPolocy = new Saml2NameIdPolicy(true, NameIdFormat.Persistent);

            Saml2RequestedAuthnContext saml2RequestedAuthnContext = new Saml2RequestedAuthnContext(
                new Uri("urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"), AuthnContextComparisonType.Exact);
            samlRequest.RequestedAuthnContext = saml2RequestedAuthnContext;
        }

        private X509Certificate2 LoadX509Certificate()
        {
            // Commented code below code can be incorporated if you want to use custom location for certificate.
            // But the recommendation is to use the Local machine Store.
            // var baseFolder = AppDomain.CurrentDomain.BaseDirectory;
            // string certificateFilePath = $"{baseFolder}\\wso2carbon.p12";

            X509Store store = new X509Store(StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly);

            X509Certificate2Collection certificatesCollection = store.Certificates;

            X509Certificate2 cert = null;

            foreach (X509Certificate2 ce in certificatesCollection)
            {
                if (ce.FriendlyName.Equals(ssoAgentConfig.X509CertificateFriendlyName) && ce.HasPrivateKey)
                {
                    cert = new X509Certificate2(ce);
                }
            }
            return cert;
        }

        public void SendPostBindingLogoutRequest(HttpContext context)
        {
            LogoutRequest logoutRequest = new LogoutRequest
            {
                DestinationUrl = new Uri(ssoAgentConfig.Saml2.IdPURL),
                Issuer = new EntityId(ssoAgentConfig.Saml2.SPEntityId)
            };
  
            string logoutRequestStr = null;

            if (ssoAgentConfig.Saml2.IsRequestSigned)
            {
                X509Certificate2 cert = LoadX509Certificate();
                
                // Embed signature element.
                logoutRequestStr = EmbedSignatureIntoAuthnRequest(logoutRequest.BuildRequest(), logoutRequest.Id.Value, cert);
            }
            else logoutRequestStr = logoutRequest.BuildRequest().ToString();            

            WritePostDataToOutputStream(context.Response, PerformBase64Encoding(logoutRequestStr));            
        }

        public string BuildRedirectBindingLogoutRequest()
        {
            LogoutRequest logoutRequest = new LogoutRequest
            {
                DestinationUrl = new Uri(ssoAgentConfig.Saml2.IdPURL),
                Issuer = new EntityId(ssoAgentConfig.Saml2.SPEntityId)
            };

            string samlRequestString = "SAMLRequest=" + EncodeSamlRequest(logoutRequest.BuildRequest().ToString());

            if (ssoAgentConfig.Saml2.IsRequestSigned)
            {
                X509Certificate2 cert = LoadX509Certificate();
                string signedReq = DoSignRedirectRequest(samlRequestString, cert);

                return string.Concat(ssoAgentConfig.Saml2.IdPURL, "?", signedReq);
            }
            else return string.Concat(ssoAgentConfig.Saml2.IdPURL, "?", samlRequestString);
        }

        public void SendPostBindingLoginRequest(HttpContext context)
        {
            AuthenticationRequest samlRequest = new AuthenticationRequest();
            InitializeAuthnRequestProperties(samlRequest);

            string authnRequest = null;
            if (ssoAgentConfig.Saml2.IsRequestSigned)
            {
                X509Certificate2 cert = LoadX509Certificate();

                // Embed signature element.
                authnRequest = EmbedSignatureIntoAuthnRequest(samlRequest.BuildAuthnRequest(), samlRequest.Id.Value, cert);
            }
            else authnRequest = samlRequest.BuildAuthnRequest().ToString();

            WritePostDataToOutputStream(context.Response, PerformBase64Encoding(authnRequest));            
        }

        private void WritePostDataToOutputStream(HttpResponse response, string samlRequest)
        {

            response.Clear();
            response.ContentType = "text/html";
            StringBuilder sb = new StringBuilder();

            // TODO: Make the below html content customizable with an external resource file.
            sb.Append("<html>");
            sb.AppendFormat(@"<body onload='document.forms[""form""].submit()'>");
            sb.AppendFormat("<p>Now you are being redirected to IDP. If the redirection fails, click the POST button below.</p></n>");
            sb.AppendFormat("<form name='form' action='{0}' method='post'>", ssoAgentConfig.Saml2.IdPURL);
            sb.AppendFormat("<button type='submit'>POST</button>");
            sb.AppendFormat("<input type='hidden' name='SAMLRequest' value='{0}'>", samlRequest);
            sb.Append("</form>");
            sb.Append("</body>");
            sb.Append("</html>");

            response.Write(sb.ToString());
            response.End();
        }

        public void ProcessSAMLResponse(HttpRequest request,HttpResponse response)
        {
            string samlResponse = request.Params[SSOAgentConstants.SAML2SSO.HTTP_POST_PARAM_SAML2_RESP];
            
            if (samlResponse != null)
            {
                string decodedResponse = Encoding.UTF8.GetString(Convert.FromBase64String(samlResponse));
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(decodedResponse);
                XmlElement element = xmlDoc.DocumentElement;
                if (element.LocalName.Equals("LogoutResponse"))
                {
                    // This is a logout response.
                    HttpContext.Current.Session.Abandon();
                    response.Redirect(ssoAgentConfig.Saml2.PostLogoutRedirectURL);
                }
                else {                   
                    ProcessSSOResponse(request,response);
                    response.Redirect(HttpContext.Current.Session["loginRequestedFrom"].ToString());
                }
            }
        }

        private void ProcessSSOResponse(HttpRequest request,HttpResponse response)
        {
            string samlResponseString = request.Params[SSOAgentConstants.SAML2SSO.HTTP_POST_PARAM_SAML2_RESP];
            XmlElement AssertionXmlElement = null;

            if (samlResponseString != null)
            {
                string decodedResponse = Encoding.UTF8.GetString(Convert.FromBase64String(samlResponseString));
               
                XmlDocument xmlDoc = new XmlDocument { PreserveWhitespace = true };
                xmlDoc.LoadXml(decodedResponse);
  
                ValidateSAMLResponseStructure(xmlDoc.DocumentElement);

                if (ssoAgentConfig.Saml2.IsResponseSigned)
                {
                    ValidateSignature(xmlDoc);
                }
                
                XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDoc.NameTable);
                nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");

                if (xmlDoc.DocumentElement.SelectSingleNode("//saml2:EncryptedAssertion",nsManager) != null)
                {
                    X509Certificate2 cert = LoadX509Certificate();
                    List<SecurityToken> serviceTokens = new List<SecurityToken>
                    {
                        new X509SecurityToken(cert)
                    };

                    
                    var issuers = new ConfigurationBasedIssuerNameRegistry();

                    // For creating an object of type SecurityTokenHandlerConfiguration,
                    // we create a dummy issuer.
                    issuers.AddTrustedIssuer("...thumbprintHere...", "notTheRealName");
                    
                    var configuration = new SecurityTokenHandlerConfiguration
                    {
                        AudienceRestriction = { AudienceMode = AudienceUriMode.Never },
                        CertificateValidationMode = X509CertificateValidationMode.None,
                        RevocationMode = X509RevocationMode.NoCheck,
                        IssuerNameRegistry = issuers,
                        MaxClockSkew = TimeSpan.FromMinutes(5),
                        ServiceTokenResolver = new Saml2SSOSecurityTokenResolver(serviceTokens)
                    };

                    var tokenHandlers = SecurityTokenHandlerCollection.CreateDefaultSecurityTokenHandlerCollection(configuration);
                    
                    XmlNodeReader tokenReader = new XmlNodeReader(xmlDoc.DocumentElement.SelectSingleNode("//saml2:EncryptedAssertion", nsManager)); 
                    
                    if (tokenHandlers.CanReadToken(tokenReader))
                    {
                        SecurityToken token = tokenHandlers.ReadToken(tokenReader);
                        XElement xElement = ((Saml2SecurityToken)token).Assertion.ToXElement();
                        AssertionXmlElement =  XElementToXMLDocument(xElement).DocumentElement;

                    } else throw new Exception("Unreadable token was encountered.");
                   
                }
                else if (xmlDoc.DocumentElement.SelectSingleNode("//saml2:Assertion", nsManager) != null)
                {
                    AssertionXmlElement = (XmlElement)xmlDoc.DocumentElement.SelectSingleNode("//saml2:Assertion", nsManager);
                }

                ValidateAssertionValidityPeriod(AssertionXmlElement);

                ValidateAudienceRestriction(AssertionXmlElement.OwnerDocument);

                HttpContext.Current.Session["SessionIndex"] = GetSessionIndex(AssertionXmlElement.OwnerDocument);
                HttpContext.Current.Session["Saml2Subject"] = GetSaml2Subject(AssertionXmlElement.OwnerDocument);
                HttpContext.Current.Session["claims"] = ProcessAttributeStatement(AssertionXmlElement.OwnerDocument);
            }
        }

        private Saml2Subject GetSaml2Subject(XmlDocument xmlDocument)
        {
            XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDocument.NameTable);
            nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");

            XmlNode subjectNode = xmlDocument.SelectSingleNode("//saml2:Subject",nsManager);
            XmlNode nameIDNode =  subjectNode.SelectSingleNode("//saml2:NameID",nsManager);

            Saml2NameIdentifier nameId = new Saml2NameIdentifier(nameIDNode.InnerText, new Uri(nameIDNode.Attributes["Format"].Value));

            return new Saml2Subject(nameId);           
        }

        private Dictionary<String, String> ProcessAttributeStatement(XmlDocument xmlDocument)
        {
            Dictionary<String, String> claimsDictionary = new Dictionary<string, string>();
            
            XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDocument.NameTable);
            nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");

            XmlNode attributeStmtXmlNode = xmlDocument.SelectSingleNode("//saml2:AttributeStatement",nsManager);
            XmlNodeList attributeNodesList = attributeStmtXmlNode.SelectNodes("//saml2:Attribute",nsManager);

            foreach (XmlNode attributeNode in attributeNodesList)
            {
                string attributeName = attributeNode.Attributes["Name"].Value;
                string attributeValue = attributeNode.SelectSingleNode("//saml2:AttributeValue",nsManager).InnerText;
                
                claimsDictionary[attributeName] = attributeValue;
            }

            return claimsDictionary;
        }

        private string GetSessionIndex(XmlDocument xmlDocument)
        {
            XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDocument.NameTable);
            nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");

            XmlNode authnStmtXmlNode = xmlDocument.SelectSingleNode("//saml2:AuthnStatement", nsManager);

            return authnStmtXmlNode.Attributes["SessionIndex"].Value;
        }

        private void ValidateSignature(XmlDocument Doc)
        {
            if (Doc == null)
                throw new SSOAgentException("Signature validation failed since argument to the method ValidateSignature was null.");

            SignedXml signedXml = new SignedXml(Doc);

            XmlNamespaceManager nsManager = new XmlNamespaceManager(Doc.NameTable);
            nsManager.AddNamespace("ds", "http://www.w3.org/2000/09/xmldsig#");

            XmlNode node = Doc.SelectSingleNode("//ds:Signature", nsManager);

            // Find signature node.
            XmlNode certElement = Doc.SelectSingleNode("//ds:X509Certificate", nsManager);

            // Find certificate node.
            X509Certificate2 cert = new X509Certificate2(Convert.FromBase64String(certElement.InnerText));
            signedXml.LoadXml((XmlElement)node);

            if (!signedXml.CheckSignature())
            {
                throw new SSOAgentException("Signature validation Failed for SAML Response. Cannot Proceed Further.");
            }
        }

        private void ValidateAudienceRestriction(XmlDocument xmlDocument)
        {
            XmlElement response = xmlDocument.DocumentElement;
            
            XmlNodeList audienceRestrictions = response.GetElementsByTagName("saml2:AudienceRestriction");
            if (audienceRestrictions.Count > 0)
            {
                Boolean expectedAudiencefound = false;

                foreach (XmlNode audienceRestriction in audienceRestrictions)
                {
                    XmlNamespaceManager nsManager = new XmlNamespaceManager(xmlDocument.NameTable);
                    nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");
                    XmlNodeList audiences = audienceRestriction.SelectNodes("/saml2:AudienceRestriction/saml2:Audience",nsManager);
                    foreach (XmlNode audience in audiences)
                    {
                        if ((ssoAgentConfig.Saml2.SPEntityId).Equals(audience.InnerText))
                        {
                            expectedAudiencefound = true;
                            break;
                        }
                    }
                }
                if (expectedAudiencefound)
                {
                    throw new SSOAgentException("Audience restriction validation failed for the SAML Assertion.");
                }
            }
            else
            {
                throw new SSOAgentException("Response does not contain audience restrictions");
            }
        }

        private void ValidateAssertionValidityPeriod(XmlElement response)
        {
            XmlNodeList conditionsNodeList =  response.GetElementsByTagName("Conditions");
            if (conditionsNodeList.Count == 1)
            {               
                DateTime notBefore = DateTime.ParseExact(conditionsNodeList[0].Attributes["NotBefore"].Value, "yyyy-MM-ddThh:mm:ssZ", 
                    CultureInfo.InvariantCulture);
                DateTime notAfter = DateTime.ParseExact(conditionsNodeList[0].Attributes["NotOnOrAfter"].Value, "yyyy-MM-ddThh:mm:ssZ", 
                    CultureInfo.InvariantCulture);

                int timeStampSkew = ssoAgentConfig.Saml2.GetTimeStampSkewInSeconds();
                
                if (notBefore != null && notBefore.AddSeconds(-timeStampSkew) > DateTime.Now)
                {
                    throw new SSOAgentException("Falied to meet assertion condition NotBefore.");
                }
               
                if (notAfter != null && notAfter.AddSeconds(timeStampSkew) < DateTime.Now)
                {
                    throw new SSOAgentException("Falied to meet assertion condition NotAfter.");
                }

                if (notBefore > notAfter)
                {
                    throw new SSOAgentException("Invalid values for NotBefore and NotAfer conditions since NotBefore > NotAfter.");
                }
            }
        }

        private void ValidateSAMLResponseStructure(XmlElement xmlElement)
        {
            if (xmlElement.LocalName != "Response" || xmlElement.NamespaceURI != Saml2Namespaces.Saml2P)
            {
                throw new XmlException("Expected a SAML2 assertion document. Response element was not found!");
            }

            XmlNodeList nodeList = xmlElement.GetElementsByTagName("Response", Saml2Namespaces.Saml2PName);
            if (nodeList.Count > 1)
            {
                throw new XmlException("Invalid Schema for SAML respose since multiple Response elements were detected.");
            }

            if (xmlElement.Attributes["Version"].Value != "2.0")
            {
                throw new XmlException("Unsupported SAML version encountered.Version 2.0 is expected.");
            }

            XmlNodeList assertionNodes = xmlElement.GetElementsByTagName("Assertion", Saml2Namespaces.Saml2Name);
            if (assertionNodes.Count > 1)
            {
                throw new XmlException("Invalid SAML2 schema since multiple Assertion elements were found.");
            }          
        }

        private String DoSignRedirectRequest(string samlRequestString,X509Certificate2 cert)
        {
            RSACryptoServiceProvider key = (RSACryptoServiceProvider)cert.PrivateKey;

            String sigAlgAdded = String.Concat(samlRequestString, "&SigAlg=", HttpUtility.UrlEncode("http://www.w3.org/2000/09/xmldsig#rsa-sha1", Encoding.UTF8));

            byte[] data = Encoding.UTF8.GetBytes(sigAlgAdded);
            byte[] sig = key.SignData(data, new SHA1Managed());
            String base64Str = Convert.ToBase64String(sig, Base64FormattingOptions.None);
            return String.Concat(sigAlgAdded, "&Signature=", HttpUtility.UrlEncode(base64Str));
        }

        public static string EncodeSamlRequest(String authnRequest)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(authnRequest);
            using (var output = new MemoryStream())
            {
                using (var zip = new DeflateStream(output, CompressionMode.Compress))
                {
                    zip.Write(bytes, 0, bytes.Length);
                }
                string base64Str = Convert.ToBase64String(output.ToArray());
                return HttpUtility.UrlEncode(base64Str);
            }
        }

        public static string PerformBase64Encoding(String authnRequest)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(authnRequest);
            string base64 = Convert.ToBase64String(bytes);
            return base64;           
        }

        private string EmbedSignatureIntoAuthnRequest(XElement xElement, string id, X509Certificate2 cert)
        {
            StringWriter sw = new StringWriter();
            XmlTextWriter xw = new XmlTextWriter(sw);
            BuildSignature(XElementToXMLDocument(xElement), id, cert).WriteTo(xw);
            return sw.ToString();
        }

        private static XmlDocument BuildSignature(XmlDocument doc, String id, X509Certificate2 cert)
        {
            X509Certificate2 requestSigningCert = cert;

            doc.PreserveWhitespace = true;

            SignedXml signedXml = new SignedXml(doc);

            KeyInfo keyInfo = new KeyInfo();

            keyInfo.AddClause(new KeyInfoX509Data(requestSigningCert));

            signedXml.KeyInfo = keyInfo;

            signedXml.SignedInfo.CanonicalizationMethod = SignedXml.XmlDsigExcC14NTransformUrl;

            RSACryptoServiceProvider rsaKey = (RSACryptoServiceProvider)requestSigningCert.PrivateKey;

            signedXml.SigningKey = rsaKey;

            Reference reference = new Reference
            {
                Uri = "#" + id
            };

            XmlDsigEnvelopedSignatureTransform env = new XmlDsigEnvelopedSignatureTransform();

            reference.AddTransform(env);

            XmlDsigExcC14NTransform c16n = new XmlDsigExcC14NTransform();

            //c16n.PropagatedNamespaces.Add("ds", "http://www.w3.org/2000/09/xmldsig#");
            // line above throws null pointer exception.

            reference.AddTransform(c16n);
            signedXml.AddReference(reference);

            // Now we can compute the signature.
            signedXml.ComputeSignature();

            // Append signature to document.
            XmlElement xmlDigitalSignature = signedXml.GetXml();

            XmlNamespaceManager nsManager = new XmlNamespaceManager(doc.NameTable);
            nsManager.AddNamespace("saml2", "urn:oasis:names:tc:SAML:2.0:assertion");

            doc.DocumentElement.InsertAfter(doc.ImportNode(xmlDigitalSignature, true), doc.SelectSingleNode("//saml2:Issuer", nsManager));

            return doc;
        }

        private XmlDocument XElementToXMLDocument(XElement x)
        {
            StringBuilder sb = new StringBuilder();
            XmlWriterSettings xws = new XmlWriterSettings();
            xws.OmitXmlDeclaration = true;
            xws.Indent = true;

            using (XmlWriter xw = XmlWriter.Create(sb, xws))
            {
                XElement child2 = x;
                child2.WriteTo(xw);
            }

            Console.WriteLine(sb.ToString());

            XmlDocument doc = new XmlDocument
            {
                PreserveWhitespace = true
            };

            doc.LoadXml(sb.ToString());

            return doc;
        }

    }
}