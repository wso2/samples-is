<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<!-- localize.jsp MUST already be included in the calling script -->
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>

<%@include file="../localize.jsp" %>
<%@include file="../init-url.jsp" %>

<!-- header -->
<header class="header header-default">
    <div class="container-fluid logo-container">
        <div class="pull-left brand float-remove-xs text-center-xs">
            <a href="#">
                <img src="http://pluspng.com/img-png/PNG_transparency_demonstration_1.png"
                    alt="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.name")%>"
                    title="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.name")%>" class="logo">
                <h1><em>XYZ Company</em></h1>
            </a>
        </div>
    </div>
    <style type="text/css">
        body {
            background: #1e1e2f;
            color: #ffffff;
        }

        .logo-container {
            padding: 15px 30px;
        }

        header .brand img.logo {
            height: 40px;
        }

        .wr-title {
            background: #32344e !important;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .header {
            border-top: 3px solid #1e8cf8;
            background: #1e1e2f;
            min-height: 70px;
            border-bottom: 1px solid #31314b;
        }

        .boarder-all {
            background: #27293d;
            border: 0;
            position: relative;
            width: 100%;
            margin-bottom: 30px;
            box-shadow: 0 1px 20px 0 rgba(0, 0, 0, .1);
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        .wr-login input[type=text],
        .wr-login input[type=password] {
            height: 45px;
            padding: 10px 15px;
            font-size: 1.3rem;
            line-height: 1.42857;
            color: #cbcbcb;
            background-color: #27293d;
            background-clip: padding-box;
            border: 1px solid #cad1d7;
            box-shadow: none;
            border-color: #2b3553;
            border-radius: 10px;
        }

        .wr-btn {
            background: linear-gradient(0deg, #3358f4, #1d8cf8);
            border-radius: 10px;
        }

        .form-group label {
            font-weight: normal;
        }

        .wr-login input[type=text]:focus,
        .wr-login input[type=password]:focus {
            border-color: #1d8cf8;
        }

        .alert-warning {
            background: #1e1e2f;
            color: white;
            border: 1px solid #f8b01e;
            margin-bottom: 10px;
        }

        .footer {
            border-top: 1px solid #31314b;
            background: #1e1e2f;
            min-height: 70px;
        }

        .footer p {
            text-align: center;
            margin-top: 20px;
        }

        .checkbox {
            margin-bottom: 0;
        }

        a {
            color: #1e8cf8;
        }

        a:hover,
        a:active {
            color: #3a9dff;
        }
    </style>

</header>
