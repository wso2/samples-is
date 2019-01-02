<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SLOManagerIFrame.aspx.cs" Inherits="Sample2.SLOManagerIFrame" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title></title>
    
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
        <script type = "text/javascript">
            var xhr;

            function CheckIfLoggedIn() {
                xhr = $.ajax({
                    type: "POST",
                    url: "CheckSession.asmx/GetSessionValue",
                    data: '{name: "hello" }',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: OnSuccess,
                    complete: function () { setTimeout(CheckIfLoggedIn,4000) },
                    failure: function(response) {
                        alert(response.d);
                    }
                });
            }

            function OnSuccess(response) {
                var resp = response.d;
                //console.log(response.d);

                if (resp == "true") {
                    //You can handle logout as 
                    PerformRedirect();
                }
            }

            function PerformRedirect() {
                //xhr.abort();
                window.top.location.href = "http://localhost:60662/music-store/Default";
            }

        </script>

    </head>

    <body onload = "CheckIfLoggedIn();">
    </body>
</html>
