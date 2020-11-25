package org.wso2.carbon.identity.extensions;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.authz.OAuthAuthzReqMessageContext;
import org.wso2.carbon.identity.oauth2.token.JWTTokenIssuer;
import org.wso2.carbon.identity.oauth2.token.OAuthTokenReqMessageContext;

import com.nimbusds.jwt.JWTClaimsSet;

public class CustomJWTTokenIssuer extends JWTTokenIssuer {
	private static final Log log = LogFactory.getLog(CustomJWTTokenIssuer.class);
	private static final String SCOPE = "scope";
	String scope;
	String[] scopeSplit;

	public CustomJWTTokenIssuer() throws IdentityOAuth2Exception {
		super();
		if (log.isDebugEnabled()) {
			log.debug("CustomJWT Access token Issuer is initiated");
		}

	}

	@Override
	protected JWTClaimsSet createJWTClaimSet(OAuthAuthzReqMessageContext authAuthzReqMessageContext,
			OAuthTokenReqMessageContext tokenReqMessageContext, String consumerKey) throws IdentityOAuth2Exception {
		// TODO Auto-generated method stub

		JWTClaimsSet jwtClaimsSet = super.createJWTClaimSet(authAuthzReqMessageContext, tokenReqMessageContext,
				consumerKey);
		scope = (String) jwtClaimsSet.getClaim(SCOPE);
		if (scope != null && !scope.isEmpty()) {
			if (log.isDebugEnabled()) {
				log.debug("Scope Exist for the jwt access token");
			}
			scopeSplit = scope.split("\\s");
			JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder(jwtClaimsSet);
			jwtClaimsSetBuilder.claim(SCOPE, scopeSplit);
			return jwtClaimsSetBuilder.build();
		} else {
			if (log.isDebugEnabled()) {
				log.debug("Scope not found for the jwt acccess token");
			}
			JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder(jwtClaimsSet);
			return jwtClaimsSetBuilder.build();

		}
	}

}