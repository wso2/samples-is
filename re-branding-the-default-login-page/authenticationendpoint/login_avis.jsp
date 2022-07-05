<%--
  ~ Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Avis Login Form</title>
    <link rel="stylesheet" href="css/avis.css">
</head>

<body translate="no">
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