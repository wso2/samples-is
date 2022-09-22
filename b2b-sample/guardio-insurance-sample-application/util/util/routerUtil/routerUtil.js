/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import cookie from "cookie";
import FrontCookie from 'js-cookie';
import { signIn, signOut } from 'next-auth/react';
import { getRouterQuery } from '../orgUtil/orgUtil';

function redirect(path) {
    return {
        redirect: {
            destination: path,
            permanent: false,
        },
    }
}

function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

function orgSignin(subOrgId) {
    FrontCookie.set("orgId", subOrgId);

    signIn("wso2is", { callbackUrl: `/o/${getRouterQuery(subOrgId)}` }, { orgId: subOrgId });
}

function orgSignout() {
    FrontCookie.remove("orgId");
    signOut({ callbackUrl: "/" });
}

function emptySession(session) {
    if (session == null || session == undefined) {
        return redirect('/signin');
    }
}

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
}

function getLoggedUserId(token) {
    return parseJwt(token).sub;
}

function getLoggedUserFromProfile(profile) {
    const user = {};
    try {
        user.id = profile.sub;
        user.name = {
            "givenName": profile.given_name ? profile.given_name : "-"
            , "familyName": profile.family_name ? profile.family_name : "-"
        };
        user.emails = [profile.email];
        user.userName = profile.username;

        if (user.name == {} || !user.emails[0] || !user.userName) {
            return null
        }
        return user;
    } catch (err) {
        return null
    }
}

module.exports = {
    redirect, parseCookies, orgSignin, orgSignout, emptySession, getLoggedUserId, getLoggedUserFromProfile
};
