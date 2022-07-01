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
