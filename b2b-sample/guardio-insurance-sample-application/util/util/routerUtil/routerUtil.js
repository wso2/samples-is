import cookie from "cookie";
import FrontCookie from 'js-cookie';
import { signOut } from 'next-auth/react';

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

function getLoggedUserFromProfile(profile){
    const user = {};
    try {
        user.id = profile.sub;
        user.name = { "givenName": profile.given_name };
        user.emails = [profile.email];
        user.userName = profile.username;
        
        if (user.name=={}|| !user.emails[0] || !user.userName) {
            return null
        }
        return user;
    } catch (err) {
        return null
    }
}

module.exports = {
     redirect, parseCookies, orgSignout, emptySession, getLoggedUserId, getLoggedUserFromProfile
};