# Introduction

This contains sample app for browser client. This sample app will explain how to integrate WSO2-IAM with
OpenID connect for authentication and authorization of your client apps' users.
This example sample app demonstrate basic HTML and Javascript approach.
Besides, same approach can be used to integrate on other Javascript frameworks (React, Angular, etc.).

# Usage

For detailed setup and execution guide refer the confluence documentation. The approach is metntioned in step by step and all the concepts are explained in there.

   1. For basic HTML SPA sample app:
   
        a. Clone or download the [samples-is](https://github.com/wso2/samples-is) repository.
         
		b. Change configurations found
		 in `sample-is/client-samples/oidc-client-app-samples/browser-client-app-sample/SPA_HTML_app/js/app.js`
		
		c. Deploy `SPA_HTML_app` application found at `sample-is/client-samples/oidc-client-app-samples/browser-client-app-sample/SPA_HTML_app` using Apache Tomcat
		
		d. Visit the SPA app on browser.
		
		By default, application will run on the following URL - [http://localhost:8080/SPA_HTML_app/](http://localhost:8080/SPA_HTML_app/)

   2. For React SPA sample app:
		
		a. Clone or download the [samples-is](https://github.com/wso2/samples-is) repository.
		
		b. Change configurations found 
		 in `sample-is/client-samples/oidc-client-app-samples/browser-client-app-sample/SPA_React_app/app/Base.js`
		
		c. Deploy `SPA_React_app` by running `npm start` command from the `SPA_React_app` folder
		
		d. Visit the SPA app on browser.