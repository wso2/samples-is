# Identity Server Re-branding the Default Login Page

1. Rename the login.jsp to default_login.jsp
2. Create a new file called login.jsp with the following code
    ```
   <%
    String relyingParty = request.getParameter("relyingParty");
    if (relyingParty.equals("travelocity.com")) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("travelocity_login.jsp");
        dispatcher.forward(request, response);
    } else if (relyingParty.equals("avis.com")) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("avis_login.jsp");
        dispatcher.forward(request, response);
    } else {
        RequestDispatcher dispatcher = request.getRequestDispatcher("default_login.jsp");
        dispatcher.forward(request, response);
    }
    %>
   ```
3. Add the theme files, jsp, css and images
    1. Travelocity 
       - travelocity_login.jsp
       - css/travelocity.css

   2. Travelocity
       - avis_login.jsp
       - css/avis.css
       - authenticationendpoint/images/user_icon.png
       - authenticationendpoint/images/lock_icon.png
