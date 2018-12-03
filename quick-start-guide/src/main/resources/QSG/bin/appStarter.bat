@echo off
set QSG=%cd%
SetLocal EnableDelayedExpansion
REM ----------------------------------------------------------------------------
REM  Copyright 2018 WSO2, Inc. http://www.wso2.org
REM
REM  Licensed under the Apache License, Version 2.0 (the "License");
REM  you may not use this file except in compliance with the License.
REM  You may obtain a copy of the License at
REM
REM      http://www.apache.org/licenses/LICENSE-2.0
REM
REM  Unless required by applicable law or agreed to in writing, software
REM  distributed under the License is distributed on an "AS IS" BASIS,
REM  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
REM  See the License for the specific language governing permissions and
REM  limitations under the License.

REM ===============script starts here ===============================================

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "server.host.domain" server.properties') DO SET SERVER_DOMAIN=%%i
REM echo %SERVER_DOMAIN%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "server.host.port" server.properties') DO SET SERVER_PORT=%%i
REM echo %SERVER_PORT%

echo "   Stating sample apps.. "
echo ""
echo "      Using Host : %SERVER_DOMAIN% "
echo "      Using Port : %SERVER_PORT% "

java -jar jetty-runner.jar --host %SERVER_DOMAIN% --port %SERVER_PORT% pickup-dispatch.war pickup-manager.war saml2-web-app-pickup-dispatch.com.war saml2-web-app-pickup-manager.com.war
