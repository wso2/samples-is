<%--
  ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>
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
        <span>Login to Travelacity.com</span>
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