<%@ include file="includes/localize.jsp" %>
<%
    String inputType = request.getParameter("inputType");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Travelocity Login Form</title>
    <link rel="stylesheet" href="css/travelocity.css">
</head>

<body translate="no">
<div class='login'>
    <div class='login_title'>
        <span>Login to your account</span>
    </div>
    <div class='login_fields'>
        <form action="../../commonauth" method="POST">
            <div class='login_fields__user'>
                <div class='icon'>
                    <img src='images/user_icon.png'>
                </div>
                <input placeholder='Username' type='text' name="username"/>
            </div>
            <div class='login_fields__password'>
                <div class='icon'>
                    <img src='images/lock_icon.png'>
                </div>
                <input placeholder='Password' type='password' name="password">
            </div>
            <div class="login_fields__password">
                <div class="ui checkbox">
                    <input tabindex="3" type="checkbox" id="chkRemember" name="chkRemember" data-testid="login-page-remember-me-checkbox">
                    <label for="chkRemember"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "remember.me")%></label>
                </div>
            </div>
            <div class='login_fields__submit'>
                <input type="hidden" name="sessionDataKey" value="<%=request.getParameter("sessionDataKey")%>"/>
                <input type='submit' value='Log In'>
            </div>
        </form>
    </div>
    <div class='disclaimer'>
        <p><%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.cookies.short.description")%>
            <a href="cookie_policy.do" target="policy-pane" data-testid="login-page-cookie-policy-link">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.cookies")%>
            </a>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.for.more.details")%>
            <br><br>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.privacy.short.description")%>
            <a href="privacy_policy.do" target="policy-pane" data-testid="login-page-privacy-policy-link">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "privacy.policy.general")%>
            </a></p>
    </div>
</div>
</body>
</html>