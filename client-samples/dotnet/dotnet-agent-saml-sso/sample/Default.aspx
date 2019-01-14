<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="sample._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="jumbotron" style="background-image:url('cover.jpeg');background-size: 1170px 640px;height:530px;">
        <h1 style="color: #946E49;text-shadow: 10px;text-shadow: 4px 3px 4px black;">Trip Guider</h1>
        <h2 style="color: #A8805D;text-shadow: 10px;text-shadow: 3px 2px 1px black;font-size: 30px;
font-weight: bold;">&nbsp;Your ever trusted guidience is now offered online!</h2>

        <%  Dictionary<String, String> Claims = (Dictionary<String, String>)HttpContext.Current.Session["claims"];

            if (Claims != null)
            {%>
                <p class="center-elem"><a href="samllogout" class="btn btn-primary btn-lg btn-font">SIGN OUT &raquo;</a></p>
        <% }
           else
           {%>
                <p class="center-elem"><a href="samlsso" class="btn btn-primary btn-lg btn-font">SIGN IN &raquo;</a></p>
        <% } %>
    </div>
    <% if (Claims != null)
             { %>
            <div class="jumbotron">
                <p>You have successfully Logged In. Following claims were recieved. <br/>
                    <% foreach (var claim in Claims)
                       { %>
                            <%=claim.Key + " = " + claim.Value%><br/>
                    <% }%>
                </p>
            </div>
    <% }
       else
       { %>
        <div class="row">
            <div class="col-md-12">
                <h2>Discover more by logging in...</h2>
                <p>you can easily login to trip guider by using your wso2 Idenity Server credentials. </p>
            </div>
        </div>
    <% } %>
    <IFRAME id="rpIFrame" frameborder="0" width="0" height="0" runat="server"></IFRAME>
</asp:Content>
