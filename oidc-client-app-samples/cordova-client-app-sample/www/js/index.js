/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    console.log("onDeviceReady");
    $('#loginPage').show();
    $('#homePage').hide();

    application = new App();

    var authorize = document.querySelector('#oidcLogin');
    authorize.addEventListener('click', function (event) {
      console.log("click");
      application.makeAuthorizationRequest();
      event.preventDefault();
    });
  },
};

app.initialize();

function handleOpenURL(url) {
  dismissBrowser();
  application.processAuthorizeResponse(url);
}

function openBrowser(url) {
  SafariViewController.isAvailable(function (available) {
    if (available) {
      SafariViewController.show({
          url: url,
          hidden: false, // default false. You can use this to load cookies etc in the background (see issue #1 for details).
          animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
          transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
          enterReaderModeIfAvailable: false, // default false
          // tintColor: "#00ffff", // default is ios blue
          // barColor: "#0000ff", // on iOS 10+ you can change the background color as well
          tintColor: "#fc511f",
          barColor: "#fc511f",
          controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
        },
        // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
        function (result) {
          if (result.event === 'opened') {
            console.log('opened');
          } else if (result.event === 'loaded') {
            console.log('loaded');
          } else if (result.event === 'closed') {
            console.log('closed');
          }
        },
        function (msg) {
          console.log("KO: " + msg);
        })
    } else {
      cordova.plugins.browsertab.isAvailable(function (result) {
        if (!result) {
          // potentially powered by InAppBrowser because that (currently) clobbers window.open
          window.open(url, '_system', 'location=yes');
        } else {
          cordova.plugins.browsertab.openUrl(
            url, {
              scheme: AppConfigJson.redirectUri
            },
            function (successResp) {},
            function (failureResp) {
              error.textContent = "failed to launch browser tab";
              error.style.display = '';
            });
        }
      });
    }
  })
}

function dismissBrowser() {
  SafariViewController.isAvailable(function (available) {
    if (available) {
      SafariViewController.hide();
    } else {
      cordova.plugins.browsertab.isAvailable(function (result) {
        if (result) {
          cordova.plugins.browsertab.close();
        } else {
          window.close();
        }
      });
    }
  })
}

function authCompletionCallback(idToken) {
  var userAttributes = parseJwt(idToken);
  var user = userAttributes.sub;
  $('.navbar-collapse').removeClass('show');
  $('#loginPage').hide();
  $('#profile-content').hide();
  $('#homePage').show();
  $('#main-content').show();

  $('#welcome').text('Welcome ' + user + '!')
  $('#user').text(user);
  pupulateUserData(userAttributes);
}

function logoutCompletionCallback() {
  $('.navbar-collapse').removeClass('show');
  $('#loginPage').show();
  $('#homePage').hide();
}

function showProfileCallback() {
  $('.navbar-collapse').removeClass('show');
  $('#loginPage').hide();
  $('#main-content').hide();
  $('#profile-content').show();
}

function showHomeCallback() {
  $('.navbar-collapse').removeClass('show');
  $('#loginPage').hide();
  $('#profile-content').hide();
  $('#homePage').show();
  $('#main-content').show();
}

function pupulateUserData(userAttributes) {
  $('.jumbotron-heading').text(userAttributes.sub);
  $('#given_name').text(userAttributes.given_name);
  $('#family_name').text(userAttributes.family_name);
  $('#email').text(userAttributes.email);
  $('#country').text(userAttributes.country);
  $('#phone_number').text(userAttributes.phone_number);
}

/**
 * Deocode JWT
 */
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};
