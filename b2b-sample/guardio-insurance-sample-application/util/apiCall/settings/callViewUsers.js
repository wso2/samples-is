import Cookie from 'js-cookie';
import config from '../../../config.json';
import { getInternalApiRequestOptions } from '../../util/apiUtil/getInteralApiRequestOptions';

const subOrgId = Cookie.get("orgId");

export default async function callViewUsers(session) {
    try {
        const res = await fetch(
            `${config.WSO2IS_CLIENT_URL}/api/settings/viewUsers`,
            getInternalApiRequestOptions(session, subOrgId)
        );
        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}