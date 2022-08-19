import { RequestMethod } from './requestMethod';

function getInternalApibBody(session, subOrgId) {
    const body = {
        session: session,
        subOrgId: subOrgId
    }
    return body;
}

function getInternalApibBodyWithParam(session, subOrgId, param){
    var body = getInternalApibBody(session,subOrgId);
    body.param = param;

    return body;
}

function getInternalApiRequestOptions(session, subOrgId) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBody(session, subOrgId))
    }
    return request;
}

function getInternalApiRequestOptionsWithParam(session, subOrgId, param) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBodyWithParam(session, subOrgId, param))
    }
    return request;
}

module.exports = { getInternalApiRequestOptions,getInternalApiRequestOptionsWithParam }