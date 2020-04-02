<%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.apache.cxf.jaxrs.provider.json.JSONProvider" %>
<%@ page import="org.apache.http.HttpStatus" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.client.SelfUserRegistrationResource" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.ResendCodeRequestDTO" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.bean.UserDTO" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="javax.ws.rs.core.Response" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isSelfSignUpEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isRecoveryEPAvailable" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.getServerURL" %>

<jsp:directive.include file="init-loginform-action-url.jsp"/>


<script>
        function submitCredentials (e) {
            e.preventDefault();
            var userName = document.getElementById("username");
            userName.value = userName.value.trim();
            if(userName.value){
                $.ajax({
                    type: "GET",
                    url: "/logincontext?sessionDataKey=" + getParameterByName("sessionDataKey") + "&relyingParty=" + getParameterByName("relyingParty") + "&tenantDomain=" + getParameterByName("tenantDomain"),
                    success: function (data) {
                        if (data && data.status == 'redirect' && data.redirectUrl && data.redirectUrl.length > 0) {
                            window.location.href = data.redirectUrl;
                        } else {
                            document.getElementById("loginForm").submit();
                        }
                    },
                    cache: false
                });
            }
        }

        function goBack() {
            window.history.back();
        }
</script>

<%!
    private static final String JAVAX_SERVLET_FORWARD_REQUEST_URI = "javax.servlet.forward.request_uri";
    private static final String JAVAX_SERVLET_FORWARD_QUERY_STRING = "javax.servlet.forward.query_string";
    private static final String UTF_8 = "UTF-8";
%>
<%
    String resendUsername = request.getParameter("resend_username");
    if (StringUtils.isNotBlank(resendUsername)) {

        String url = config.getServletContext().getInitParameter(Constants.ACCOUNT_RECOVERY_REST_ENDPOINT_URL);

        ResendCodeRequestDTO selfRegistrationRequest = new ResendCodeRequestDTO();
        UserDTO userDTO = AuthenticationEndpointUtil.getUser(resendUsername);
        selfRegistrationRequest.setUser(userDTO);
        url = url.replace("tenant-domain", userDTO.getTenantDomain());

        List<JSONProvider> providers = new ArrayList<JSONProvider>();
        JSONProvider jsonProvider = new JSONProvider();
        jsonProvider.setDropRootElement(true);
        jsonProvider.setIgnoreNamespaces(true);
        jsonProvider.setValidateOutput(true);
        jsonProvider.setSupportUnwrapped(true);
        providers.add(jsonProvider);

        SelfUserRegistrationResource selfUserRegistrationResource = JAXRSClientFactory
                .create(url, SelfUserRegistrationResource.class, providers);
        Response selfRegistrationResponse = selfUserRegistrationResource.regenerateCode(selfRegistrationRequest);
        if (selfRegistrationResponse != null &&  selfRegistrationResponse.getStatus() == HttpStatus.SC_CREATED) {
%>
<div class="alert alert-info">
    <%=AuthenticationEndpointUtil.i18n(resourceBundle,Constants.ACCOUNT_RESEND_SUCCESS_RESOURCE)%>
</div>
<%
} else {
%>
<div class="alert alert-danger">
    <%=AuthenticationEndpointUtil.i18n(resourceBundle,Constants.ACCOUNT_RESEND_FAIL_RESOURCE)%>
</div>
<%
        }
    }
%>

<form action="<%=loginFormActionURL%>" method="post" id="loginForm">

    <%
        if (loginFormActionURL.equals(samlssoURL) || loginFormActionURL.equals(oauth2AuthorizeURL)) {
    %>
    <input id="tocommonauth" name="tocommonauth" type="hidden" value="true">
    <%
        }
    %>

    <% if (Boolean.parseBoolean(loginFailed)) { %>
    <div class="alert alert-danger" id="error-msg"><%= AuthenticationEndpointUtil.i18n(resourceBundle, errorMessage) %>
    </div>
    <%}else if((Boolean.TRUE.toString()).equals(request.getParameter("authz_failure"))){%>
    <div class="alert alert-danger" id="error-msg">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "unauthorized.to.login")%>
    </div>
    <%}%>

    <% if (!isIdentifierFirstLogin(inputType)) { %>
        <% if (SHOW_LOGIN_CLAIM_OPTIONS) { %>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label for="username">Email or Mobile</label>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 form-group">
                <select id="loginidentifier" name="loginidentifier" class="form-control" tabindex="0">
                    <option value="auto">- Select Identifier -</option>
                    <option value="http://wso2.org/claims/emailaddress">Email</option>
                    <option value="http://wso2.org/claims/mobile">Mobile</option>
                </select>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 form-group">
                <input id="username" name="username" type="text" class="form-control" placeholder="" required>
            </div>
        <% } else { %>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
                <label for="username">Username, Email or Mobile</label>
                <input id="username" name="username" type="text" class="form-control" tabindex="0" placeholder="" required>
            </div>
        <% } %>
    <% } else {%>
        <input id="username" name="username" type="hidden" value="<%=username%>">
    <% }%>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
        <label for="password"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "password")%></label>
        <input id="password" name="password" type="password" class="form-control" placeholder="" autocomplete="off">
    </div>
    <%
        if (reCaptchaEnabled) {
    %>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
        <div class="g-recaptcha"
             data-sitekey="<%=Encode.forHtmlContent(request.getParameter("reCaptchaKey"))%>">
        </div>
    </div>
    <%
        }
    %>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
        <div class="checkbox">
            <label>
                <input type="checkbox" id="chkRemember" name="chkRemember">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.me")%>
            </label>
        </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <input type="hidden" name="sessionDataKey" value='<%=Encode.forHtmlAttribute
            (request.getParameter("sessionDataKey"))%>'/>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <input type="hidden" name="tenantDomain" value='<%=Encode.forHtmlAttribute
            (request.getParameter("tenantDomain"))%>'/>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-double">
        <div class="alert alert-warning margin-bottom-3 padding-10" role="alert">
            <div>
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.cookies.short.description")%>
                <a href="cookie_policy.do" target="policy-pane">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.cookies")%>
                </a>
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.for.more.details")%>
            </div>
        </div>
        <div class="alert alert-warning margin-none padding-10" role="alert">
            <div>
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description")%>
                <a href="privacy_policy.do" target="policy-pane">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%>
                </a>
            </div>
        </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
        <div class="form-actions">
            <button
                    class="wr-btn grey-bg col-xs-12 col-md-12 col-lg-12 uppercase font-extra-large margin-bottom-double"
                    type="submit" onclick="submitCredentials(event)">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "login")%>
            </button>
        </div>
    </div>
        <%
            String recoveryEPAvailable = application.getInitParameter("EnableRecoveryEndpoint");
            String enableSelfSignUpEndpoint = application.getInitParameter("EnableSelfSignUpEndpoint");
            Boolean isRecoveryEPAvailable;
            Boolean isSelfSignUpEPAvailable;

            if (StringUtils.isNotBlank(recoveryEPAvailable)) {
                isRecoveryEPAvailable = Boolean.valueOf(recoveryEPAvailable);
            } else {
                isRecoveryEPAvailable = isRecoveryEPAvailable();
            }

            if (StringUtils.isNotBlank(enableSelfSignUpEndpoint)) {
                isSelfSignUpEPAvailable = Boolean.valueOf(enableSelfSignUpEndpoint);
            } else {
                isSelfSignUpEPAvailable = isSelfSignUpEPAvailable();
            }

            if (isRecoveryEPAvailable || isSelfSignUpEPAvailable) {
                String scheme = request.getScheme();
                String serverName = request.getServerName();
                int serverPort = request.getServerPort();
                String uri = (String) request.getAttribute(JAVAX_SERVLET_FORWARD_REQUEST_URI);
                String prmstr = URLDecoder.decode(((String) request.getAttribute(JAVAX_SERVLET_FORWARD_QUERY_STRING)), UTF_8);
                String urlWithoutEncoding = scheme + "://" +serverName + ":" + serverPort + uri + "?" + prmstr;
                String urlEncodedURL = URLEncoder.encode(urlWithoutEncoding, UTF_8);

                String identityMgtEndpointContext =
                        application.getInitParameter("IdentityManagementEndpointContextURL");
                if (StringUtils.isBlank(identityMgtEndpointContext)) {
                    identityMgtEndpointContext = getServerURL("/accountrecoveryendpoint", true, true);
                }

                if (isRecoveryEPAvailable) {
        %>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
            <div class="form-actions">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username.password")%>
                <% if (!isIdentifierFirstLogin(inputType)) { %>
                    <a id="usernameRecoverLink" href="<%=getRecoverUsernameUrl(identityMgtEndpointContext, urlEncodedURL)%>">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username")%>
                    </a>
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.username.password.or")%>
                <% } %>
                <a id="passwordRecoverLink" href="<%=getRecoverPasswordUrl(identityMgtEndpointContext, urlEncodedURL)%>">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "forgot.password")%>
                </a>
                ?
            </div>
    
            <div class="form-actions">
                <% if (isIdentifierFirstLogin(inputType)) { %>
                <a id="backLink" onclick="goBack()">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.different.account")%>
                </a>
                <% } %>
            </div>
        </div>
        <%
                }
                if (isSelfSignUpEPAvailable && !isIdentifierFirstLogin(inputType)) {
        %>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
            <div class="form-actions">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "no.account")%>
            <a id="registerLink" href="<%=getRegistrationUrl(identityMgtEndpointContext, urlEncodedURL)%>">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "register.now")%>
            </a>
            </div>
        </div>
        <%
                }
            }
        %>
    <% if (Boolean.parseBoolean(loginFailed) && errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_NOT_CONFIRMED_ERROR_CODE) && request.getParameter("resend_username") == null) { %>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group">
            <div class="form-actions">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "no.confirmation.mail")%>
                <a id="registerLink"
                   href="login.do?resend_username=<%=Encode.forHtml(request.getParameter("failedUsername"))%>&<%=AuthenticationEndpointUtil.cleanErrorMessages(Encode.forJava(request.getQueryString()))%>">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "resend.mail")%>
                </a>
            </div>
        </div>
        <%}%>
    </div>

    <div class="clearfix"></div>
    <%!
    private String getRecoverPasswordUrl(String identityMgtEndpointContext, String urlEncodedURL) {
        return identityMgtEndpointContext + "/recoverpassword.do?callback=" + Encode.forHtmlAttribute(urlEncodedURL);
    }
    private String getRecoverUsernameUrl(String identityMgtEndpointContext, String urlEncodedURL) {
        return identityMgtEndpointContext + "/recoverusername.do?callback=" + Encode.forHtmlAttribute(urlEncodedURL);
    }
    private String getRegistrationUrl(String identityMgtEndpointContext, String urlEncodedURL) {
        return identityMgtEndpointContext + "/register.do?callback=" + Encode.forHtmlAttribute(urlEncodedURL);
    }
    %>
</form>
