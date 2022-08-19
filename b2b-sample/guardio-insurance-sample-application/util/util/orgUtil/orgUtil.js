import config from '../../../config.json';

function checkAdmin(scopes) {
    const adminScopes = ["email", "internal_login", "internal_user_mgt_create", "internal_user_mgt_delete",
        "internal_user_mgt_list", "internal_user_mgt_update", "internal_user_mgt_view", "openid", "profile"];

    for (let i = 0; i < adminScopes.length; i++) {
        if (!scopes.includes(adminScopes[i])) {
            return false;
        }
    }

    return true;
}

function getRouterQuery(orgid) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].id == orgid) {
            return config.SAMPLE_ORGS[i].routerQuery;
        }
    }
}

function getOrg(orgId) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].id == orgId) {
            return config.SAMPLE_ORGS[i];
        }
    }
    return undefined;
}

function getOrgIdfromRouterQuery(routerQuery) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].routerQuery == routerQuery) {
            return config.SAMPLE_ORGS[i].id;
        }
    }
    return undefined;
}

module.exports = {
    checkAdmin, getRouterQuery, getOrg, getOrgIdfromRouterQuery
};