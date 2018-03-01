<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Sample2._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="jumbotron" style="background-color:transparent;">
        <h1 align="center" style="color: #FFDB9F;text-shadow: 3px 6px 4px black;font-weight: bold;">Online Music Store</h1>
        <!-- p class="lead">Description of web site</p -->
        
         <% 
             Dictionary<String, String> Claims = (Dictionary<String, String>)HttpContext.Current.Session["claims"];

             if (Claims == null)
             { %>
               <p style="margin: 0 auto;width: 321px;text-align:center;"><a href="samlsso" class="btn btn-primary btn-lg" style="background-color:transparent;background-color: transparent;
            height: 96px;width:238px;font-size: 35px;padding-top:20px;">Sign in &raquo;</a></p> 
         <% }
            else
            { %>
               <p style="margin: 0 auto;width: 321px;text-align:center;"><a href="samllogout" class="btn btn-primary btn-lg" style="background-color:transparent;background-color: transparent;
            height: 96px;width:238px;font-size: 35px;padding-top:20px;">Sign out &raquo;</a></p> 
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
                <p>you can easily login to Music Store by using your wso2 Identity Server credentials.</p>
            </div>
        </div>
    <% } %>
    <IFRAME id="rpIFrame" frameborder="0" width="0" height="0" runat="server"></IFRAME>
</asp:Content>
