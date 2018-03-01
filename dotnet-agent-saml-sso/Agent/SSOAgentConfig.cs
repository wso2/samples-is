using System.Collections.Generic;
using Agent.exceptions;
using Agent.util;
using NLog;

namespace Agent
{
    public class SSOAgentConfig
    {
        private bool isSAML2SSOLoginEnabled = false;
        public bool SAML2SSOLoginEnabled { get { return isSAML2SSOLoginEnabled; } }

        public string SetSAML2SSOLoginEnabled
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isSAML2SSOLoginEnabled = bool.Parse(value);
                }
                else
                {
                    isSAML2SSOLoginEnabled = false;
                }
            }
        }

        public string SAML2SSOURL { get; set; } = null;

        private string x509CertificateFriendlyName;
        public string X509CertificateFriendlyName {
            get
            {
                return x509CertificateFriendlyName;
            }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new SSOAgentException(SSOAgentConstants.CERT_FRIENDLY_NAME +" is not specified properly. Cannot proceed Further.");
                }
                else
                {
                    x509CertificateFriendlyName = value;
                }
            }
        }

        public SAML2 Saml2 { get; set; } = new SAML2();

        public SSOAgentConfig(Dictionary<string,string> properties)
        {
            InitConfig(properties);            
        }

        private void InitConfig(Dictionary<string,string> ssoProperties)
        {
            SetSAML2SSOLoginEnabled = ssoProperties[SSOAgentConstants.SSOAgentConfig.ENABLE_SAML2_SSO_LOGIN];
            SAML2SSOURL = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2_SSO_URL];
            X509CertificateFriendlyName = ssoProperties[SSOAgentConstants.CERT_FRIENDLY_NAME];

            Saml2.HttpBinding = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.HTTP_BINDING];
            Saml2.SPEntityId = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.SP_ENTITY_ID];
     
            Saml2.ACSURL = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ACS_URL];
            Saml2.IdPEntityId = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.IDP_ENTITY_ID];
            Saml2.IdPURL = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.IDP_URL];
            Saml2.AttributeConsumingServiceIndex = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ATTRIBUTE_CONSUMING_SERVICE_INDEX];

            Saml2.SetSLOEnabled = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_SLO];
            Saml2.SLOURL = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.SLO_URL];

            Saml2.SetAssertionSigned  = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_ASSERTION_SIGNING];
            Saml2.SetAssertionEncrypted = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_ASSERTION_ENCRYPTION];
            Saml2.SetResponseSigned = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_RESPONSE_SIGNING];
            Saml2.SetRequestSigned = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_REQUEST_SIGNING];
            Saml2.SetPassiveAuthn = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.IS_PASSIVE_AUTHN];
            Saml2.SetForceAuthn = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.IS_FORCE_AUTHN];

            Saml2.RelayState = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.RELAY_STATE];
            Saml2.PostBindingRequestHTMLPayload = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.POST_BINDING_REQUEST_HTML_PAYLOAD];
            Saml2.TimeStampSkewInSeconds = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.TIME_STAMP_SKEW];

            Saml2.PostLogoutRedirectURL = ssoProperties[SSOAgentConstants.SSOAgentConfig.SAML2.POST_LOGOUT_REDIRECT_URL];
            
        }
    }

    public class SAML2
    {
        private Logger logger = LogManager.GetCurrentClassLogger();

        private string httpBinding = null;
        private string spEntityId = null;
        private string acsURL = null;
        private string idPEntityId = null;
        private string idPURL = null;

        private string sloURL = null;
        private string attributeConsumingServiceIndex = null;

        private bool isSLOEnabled = false;     
        private bool isAssertionSigned = false;
        private bool isAssertionEncrypted = false;
        private bool isResponseSigned = false;
        private bool isRequestSigned = false;
        private bool isPassiveAuthn = false;
        private bool isForceAuthn = false;
        private string relayState = null;
        private int timeStampSkewInSeconds = 300;
        
        private string postBindingRequestHTMLPayload = null;

        public string HttpBinding
        {
            get { return httpBinding; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.HTTP_BINDING +" not configured properly. Defaulting to \'" +
                        SSOAgentConstants.SAML2SSO.SAML2_POST_BINDING_URI + "\'");
                    httpBinding = SSOAgentConstants.SAML2SSO.SAML2_POST_BINDING_URI;
                }      
                else
                {
                    httpBinding = value;
                }
            }
        }

        public string SPEntityId
        {
            get{ return spEntityId; }
            set{
                if (!string.IsNullOrWhiteSpace(value))
                {
                    spEntityId = value;
                }
                else
                {
                    throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.SAML2.SP_ENTITY_ID + 
                        "was not configured. Cannot proceed Further.");
                }
            }       
        }

        public string ACSURL
        {
            get { return acsURL; }
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    acsURL = value;
                }
                else {
                    throw new SSOAgentException( SSOAgentConstants.SSOAgentConfig.SAML2.ACS_URL + 
                        " is not specified. Cannot proceed Further.");
                }
            }          
        }

        public string IdPEntityId
        {
            get { return idPEntityId; }
            set 
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    idPEntityId = value;
                }
                else
                {
                    throw new SSOAgentException( SSOAgentConstants.SSOAgentConfig.SAML2.IDP_ENTITY_ID + 
                        " context-param is not specified in the web.xml. Cannot proceed Further.");
                }
            }
        }

        public string IdPURL
        {
            get { return idPURL; }
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    idPURL = value;
                }
                else
                {
                    throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.SAML2.IDP_URL+" is not configured. Cannot proceed further.");
                }
            }
        }
        
        public string SLOURL
        {
            get{ return sloURL; }
            set { sloURL = value; }
        }

        public string AttributeConsumingServiceIndex
        {
            get { return attributeConsumingServiceIndex; }
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    attributeConsumingServiceIndex = value;
                }
                else{
                    logger.Info("Attribute Consuming Service index is not specified.IDP configuration is required to get user attributes.");
                }
            }
        }
        
        public bool IsAssertionSigned
        {
            get { return isAssertionSigned; }
        }

        public bool IsAssertionEncrypted
        {
            get { return isAssertionEncrypted; }
        }

        public bool IsResponseSigned
        {
            get { return isResponseSigned; }
        }

        public bool IsRequestSigned
        {
           get { return isRequestSigned; }
        }

        public bool IsPassiveAuthn
        {
            get{ return isPassiveAuthn; }
        }

        public bool IsForceAuthn
        {
            get { return isForceAuthn; }
        }

        public string RelayState
        {
            get { return relayState; }
            set { relayState = value; }
        }

        public string PostBindingRequestHTMLPayload
        {
            get { return postBindingRequestHTMLPayload; }
            set { postBindingRequestHTMLPayload = value; }
        }

        public bool IsSLOEnabled
        {
            get { return isSLOEnabled; }
        }

        public string SetSLOEnabled
        {        
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isSLOEnabled = bool.Parse(value);
                }
                else
                {
                    //defaulting to false since not configured
                    isSLOEnabled = false;
                }
            } 
        }

        public string SetAssertionSigned
        {
            set{
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isAssertionSigned = bool.Parse(value);
                }
                else
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_ASSERTION_SIGNING + " not configured properly." +
                        " Defaulting to \'false\'");
                    isAssertionSigned = false;
                }
            }
        }

        public string SetAssertionEncrypted
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isAssertionEncrypted = bool.Parse(value);       
                }
                else
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_ASSERTION_ENCRYPTION +" is not configured properly." +
                        " Defaulting to \'false\'");
                    this.isAssertionEncrypted = false;
                }
            }
        }

        public string SetResponseSigned
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isResponseSigned = bool.Parse(value);
                }
                else
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_RESPONSE_SIGNING +"is not configured properly." +
                        " Defaulting to \'false\'");
                    isResponseSigned = false;
                }
            }
        }

        public string SetRequestSigned
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isRequestSigned = bool.Parse(value);
                }
                else     
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.ENABLE_REQUEST_SIGNING + "is not configured properly." +
                        " Defaulting to \'false\'");
                    isRequestSigned = false;
                }
            }
        }

        public string SetPassiveAuthn
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isPassiveAuthn = bool.Parse(value);
                }
                else{
                    //defaulting to false
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.IS_PASSIVE_AUTHN + "is not configured properly." +
                        " Defaulting to \'false\'");
                    isPassiveAuthn = false;
                }
            }
        }

        public bool PassiveAuthn
        {
             set { isPassiveAuthn = value; }
        }

        public string SetForceAuthn
        {
            set {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    isForceAuthn = bool.Parse(value);
                }
                else
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.IS_FORCE_AUTHN + 
                        "is not configured properly. Defaulting to \'false\'");
                    this.isForceAuthn = false;
                }
            }
        }

        public int GetTimeStampSkewInSeconds()
        {
            return timeStampSkewInSeconds;
        }

        public string TimeStampSkewInSeconds
        {
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    timeStampSkewInSeconds = int.Parse(value);
                }
                else
                {
                    logger.Info(SSOAgentConstants.SSOAgentConfig.SAML2.TIME_STAMP_SKEW + 
                        "is not configured properly. Defaulting to 300 seconds.");
                    timeStampSkewInSeconds = 300;
                }
            }
        }

        public string PostLogoutRedirectURL
        {
            get;set;
        }
    }
}
