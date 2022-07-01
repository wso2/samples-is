<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <title>Avis Login Form</title>
    <link rel="stylesheet" href="css/avis.css">
</head>

<body translate="no" >
<div class="wrapper">
    <div class="container">
        <h1>Welcome</h1>

        <form class="form" action="../../commonauth" method="POST">
            <label>
                <input type="text" placeholder="Username" name="username">
            </label>
            <label>
                <input type="password" placeholder="Password" name="password">
            </label>
            <input type="hidden" name="sessionDataKey" value="<%=request.getParameter("sessionDataKey")%>"/>
            <button type="submit" id="login-button">Login</button>
        </form>
    </div>

    <ul class="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>


</body>

</html>

