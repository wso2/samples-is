# Identity Server Re-branding the Default Login Page

1. Rename the login.jsp to login_default.jsp
2. Create a new file called login.jsp with the following code
    ```
   <%
    String relyingParty = request.getParameter("relyingParty");
    if (relyingParty.equals("travelocity.com")) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("login_travelocity.jsp");
        dispatcher.forward(request, response);
    } else if (relyingParty.equals("avis.com")) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("login_avis.jsp");
        dispatcher.forward(request, response);
    } else {
        RequestDispatcher dispatcher = request.getRequestDispatcher("login_default.jsp");
        dispatcher.forward(request, response);
    }
    %>
   ```
3. Add the theme files, jsp, css and images
    1. Travelocity 
       - login_travelocity.jsp
       - css/travelocity.css

   2. Travelocity
       - login_avis.jsp
       - css/avis.css
       - authenticationendpoint/images/user_icon.png
       - authenticationendpoint/images/lock_icon.png
