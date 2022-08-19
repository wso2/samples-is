import config from '../../../config.json';
import { RequestMethod } from '../../../util/util/apiUtil/requestMethod';
import { getSentDataRequestOptions } from '../../../util/util/apiUtil/getSentDataRequestOptions'

export default async function addUser(req, res) {
    if (req.method !== 'POST') {
        res.status(404).json('meData');
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const subOrgId = body.subOrgId;
    const user = body.param;

    try {
        const fetchData = await fetch(
            `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users`,
            getSentDataRequestOptions(session, RequestMethod.POST, user)
        );
        const data = await fetchData.json();
        res.status(200).json(data);    
    } catch (err) {
        res.status(404).json('meData');
    }
}