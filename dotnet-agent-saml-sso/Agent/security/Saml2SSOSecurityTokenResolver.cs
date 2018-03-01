using System;
using System.Collections.Generic;
using System.IdentityModel.Selectors;
using System.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace Agent.Security
{
    public class Saml2SSOSecurityTokenResolver : SecurityTokenResolver
    {
        List<SecurityToken> _tokens;

        public Saml2SSOSecurityTokenResolver(List<SecurityToken> tokens)
        {
            _tokens = tokens;
        }
        protected override bool TryResolveSecurityKeyCore(SecurityKeyIdentifierClause keyIdentifierClause, out SecurityKey key)
        {
            var token = _tokens[0] as X509SecurityToken;

            var myCert = token.Certificate;

            key = null;

            var ekec = keyIdentifierClause as EncryptedKeyIdentifierClause;

            if (ekec != null)
            {
                if (ekec.EncryptionMethod == "http://www.w3.org/2001/04/xmlenc#rsa-1_5")
                {
                    var encKey = ekec.GetEncryptedKey();
                    var rsa = myCert.PrivateKey as RSACryptoServiceProvider;
                    var decKey = rsa.Decrypt(encKey, false);
                    key = new InMemorySymmetricSecurityKey(decKey);
                    return true;
                }

                var data = ekec.GetEncryptedKey();
                var id = ekec.EncryptingKeyIdentifier;
            }

            return true;
        }

        protected override bool TryResolveTokenCore(SecurityKeyIdentifierClause keyIdentifierClause, out SecurityToken token)
        {
            throw new NotImplementedException();
        }

        protected override bool TryResolveTokenCore(SecurityKeyIdentifier keyIdentifier, out SecurityToken token)
        {
            throw new NotImplementedException();
        }
    }
}
