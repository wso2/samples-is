<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<!--
~   Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
~
~   Licensed under the Apache License, Version 2.0 (the "License");
~   you may not use this file except in compliance with the License.
~   You may obtain a copy of the License at
~
~        http://www.apache.org/licenses/LICENSE-2.0
~
~   Unless required by applicable law or agreed to in writing, software
~   distributed under the License is distributed on an "AS IS" BASIS,
~   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
~   See the License for the specific language governing permissions and
~   limitations under the License.
-->
<%@ page import="org.wso2.sample.identity.oauth2.OAuth2Constants" %>
<%@ page contentType="text/html;charset=UTF-8" %>

<html>
<head>
    <title>OpenID Connect Session Management RP IFrame</title>
    <script language="JavaScript" type="text/javascript">
        var client_id = '<%=session.getAttribute(OAuth2Constants.CONSUMER_KEY)%>';
        var session_state = '<%=session.getAttribute(OAuth2Constants.SESSION_STATE)%>';
        var mes = client_id + " " + session_state;
        var targetOrigin = '<%=session.getAttribute(OAuth2Constants.OIDC_SESSION_IFRAME_ENDPOINT)%>';
        var authorizationEndpoint = '<%=session.getAttribute(OAuth2Constants.OAUTH2_AUTHZ_ENDPOINT)%>';

        function check_session() {
            if (client_id !== null && client_id.length !== 0 && client_id !== 'null' && session_state !== null &&
                    session_state.length !== 0 && session_state !== 'null') {
                var win = document.getElementById("opIFrame").contentWindow;
                win.postMessage(mes, targetOrigin);
            }
        }

        function setTimer() {
            check_session();
            setInterval("check_session()", 4 * 1000);
        }

        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(e) {

            if (targetOrigin.indexOf(e.origin) < 0) {
                return;
            }

            if (e.data === "changed") {
                console.log("[RP] session state has changed. sending passive request");
                if (authorizationEndpoint !== null && authorizationEndpoint.length !== 0 && authorizationEndpoint !==
                        'null') {

                    var clientId = client_id;
                    var scope = '<%=session.getAttribute(OAuth2Constants.SCOPE)%>';
                    var responseType = '<%=session.getAttribute(OAuth2Constants.OAUTH2_GRANT_TYPE)%>';
                    var redirectUri = '<%=session.getAttribute(OAuth2Constants.CALL_BACK_URL)%>';
                    var prompt = 'none';

                    window.top.location.href = authorizationEndpoint + '?client_id=' + clientId + "&scope=" + scope +
                    "&response_type=" + responseType + "&redirect_uri=" + redirectUri + "&prompt=" + prompt;
                }
            }
            else if (e.data === "unchanged") {
                console.log("[RP] session state has not changed");
            }
            else {
                console.log("[RP] error while checking session status");
            }
        }

    </script>
</head>
<body onload="setTimer()">
<iframe id="opIFrame"
        src="<%=session.getAttribute(OAuth2Constants.OIDC_SESSION_IFRAME_ENDPOINT)%>"
        frameborder="0" width="0"
        height="0"></iframe>
</body>
</html>
