/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import { FLOW_TYPE_IMPLICIT, FLOW_TYPE_PKCE } from '@openid/appauth';

class Profile extends Component {

    constructor(props) {
        super(props);
    
        this.app = props.app;
        this.appLogout = props.appLogout;
        this.appPKCE = props.appPKCE;
        this.appUserInfo = props.appUserInfo;
    
        // This binding is necessary to make `this` work in the callback
        this.logoutClick = this.logoutClick.bind(this);
    }

    checkUserLoggedIn(currentComponent) {
        
        // No delay but a SPA trick to redirect to loggedIn view or login view
        var millisecondsToWait = 0;
        setTimeout(function() {
            // Whatever you want to do after the wait
            var authResponse = localStorage.getItem('appauth_current_authorization_response');
            
            if (!authResponse) {   
                currentComponent.props.history.push({pathname: '/Profile'});
            }
        }, millisecondsToWait);
      }


    logoutClick() {
        // Execute OIDC end session (logout) requests against WSO2 IS server
        this.appLogout.makeLogoutRequest();
    }

    componentWillMount() {

        // Redirect completion callback method execution for authorization completion callback and end session (logout) completion callabck.
        if (FLOW_TYPE_IMPLICIT == this.app.getConfiguration().flowType) {
            this.app.checkForAuthorizationResponse().then(this.checkUserLoggedIn(this));
        } else if (FLOW_TYPE_PKCE == this.app.getConfiguration().flowType) {
            this.appPKCE.checkForAuthorizationResponse().then(this.checkUserLoggedIn(this));
        }
        this.appLogout.checkForAuthorizationResponse();

        // userInfo route only works with only PKCE for now and have to do for implicit by decoding the id_token JWT
        this.appUserInfo.makeUserInfoRequest().then(userInfoJson => {
            this.sub = userInfoJson.sub;
            this.name = userInfoJson.name;
            this.given_name = userInfoJson.given_name;
            this.family_name = userInfoJson.family_name;
            this.preferred_username = userInfoJson.preferred_username;
            this.email = userInfoJson.email;
            this.picture = userInfoJson.picture;
        });
        
      }

    //TODO: Hide the logout button if the user is not logged in and show non logged in user content on this pasge
    render() {
        return (
            <div id="profilePage">
                <nav id="top" class="navbar navbar-inverse navbar-custom">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#dispatch-navbar">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand" href="#"><img src="resources/img/logo.png" alt="pickup-logo" class="pickup-logo"/> Dispatch</a>
                        </div>
                        <div class="collapse navbar-collapse" id="dispatch-navbar">
                            <ul class="nav navbar-nav navbar-right">
                            <li class="dropdown user-name">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    <img class="img-circle user-icon" src="resources/img/user-icon.jpg" alt="user-icon" /> <span class="user-name">kim@pickup.com <i class="fa fa-chevron-down"></i></span>
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="#" id="makeProfilePageLogoutRequest" onClick={this.logoutClick}>Logout</a></li>
                                </ul>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <section id="about" class="about">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 text-center">
                            <h2><strong>PickUp User Informartion</strong></h2>
                            <p class="lead">User information from the authentication server</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="view" class="view content">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-10 col-md-offset-1">
                            <h4 class="text-center">View User Information</h4>
                            <br/>
                            <div class="table-responsive">
                                <table class="table table-bordered" width="100%" id="dataTable" cellSpacing="0">
                                    <thead>
                                        <tr>
                                        <th>User sub</th>
                                        <th>User's name</th>
                                        <th>Given name</th>
                                        <th>Family name</th>
                                        <th>Preferred username</th>
                                        <th>Email</th>
                                        <th>Picture</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td id="sub">{this.sub}</td>
                                        <td id="name">{this.name}</td>
                                        <td id="given_name">{this.given_name}</td>
                                        <td id="family_name">{this.family_name}</td>
                                        <td id="preferred_username">{this.preferred_username}</td>
                                        <td id="email">{this.email}</td>
                                        <td id="picture_td"><a href="" id="picture" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer id="footer">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-10 col-md-offset-1 text-center">
                            <span class="text-muted">Copyright &copy;  <a href="http://wso2.com/" target="_blank" class="wso2-logo-link"><img src="resources/img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"/></a> &nbsp;2018</span>
                            </div>
                        </div>
                    </div>
                    <a id="to-top" href="#top" class="btn btn-dark btn-lg"><i class="fa fa-chevron-up fa-fw fa-1x"></i></a>
                </footer>
            </div>
        );
    }
}
export default withRouter(Profile);
