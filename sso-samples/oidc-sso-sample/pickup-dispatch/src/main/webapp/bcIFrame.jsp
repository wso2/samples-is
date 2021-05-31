<html>
<head>
    <title>Backchannel Logout Session Management RP IFrame</title>
    <!-- JQuery -->
    <script src="libs/jquery_3.3.1/jquery.min.js"></script>
    <script language="JavaScript" type="text/javascript">

    function check_session() {
        $.ajax({
            url: "check-bc-logout",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            error: function() {
                console.log("Session has been expired");
                window.top.location.href = "index.jsp";
            }
        });
    }
    function setTimer() {
        check_session();
        setInterval("check_session()", 10 * 1000);
    }
    </script>

</head>
<body onload="setTimer()">

</body>
</html>
