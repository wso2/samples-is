<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RpIFrame.aspx.cs" Inherits="Sample2.RpIFrame" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>OpenID Connect Session Management RP IFrame</title>
    <script language="JavaScript" type="text/javascript">

        var stat = "unchanged";
        var client_id = '<%= ConfigurationManager.AppSettings["OIDC.ClientId"] %>';
        var session_state = '<%= Session["session_state"] %>';
        var mes = client_id + " " + session_state;
        var targetOrigin = '<%= ConfigurationManager.AppSettings["OIDC.SessionIFrameEndpoint"] %>';
        var authorizationEndpoint = '<%= ConfigurationManager.AppSettings["OIDC.AuthorizeEndpoint"] %>';

        function check_session() {
            if (client_id !== null && client_id.length != 0 && client_id !== 'null' && session_state !== null &&
                    session_state.length != 0 && session_state != 'null') {
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

            if (e.data == "changed") {
                console.log("[RP] session state has changed. sending passive request");
                if (authorizationEndpoint !== null && authorizationEndpoint.length != 0 && authorizationEndpoint !==
                        'null') {

                    var clientId = client_id;
                    var scope = 'openid';
                    var responseType = 'code';
                    var redirectUri = '<%= ConfigurationManager.AppSettings["OIDC.CallBackUrl"] %>';
                    var prompt = 'none';

                    top.location.href = authorizationEndpoint + '?client_id=' + clientId + "&scope=" + scope +
                    "&response_type=" + responseType + "&redirect_uri=" + redirectUri + "&prompt=" + prompt;
                }
            }
            else if (e.data == "unchanged") {
                console.log("[RP] session state has not changed");
            }
            else {
                console.log("[RP] error while checking session status");
            }
        }

    </script>
</head>
<body onload="setTimer()" >
    <iframe id="opIFrame"
            src="https://localhost:9443/oidc/checksession?client_id=6G4s9GSYLd2USGB9f_Bf7kI6RHka"
            frameborder="0" 
            width="0"
            height="0"
            runat="server"></iframe>
</body>
</html>
