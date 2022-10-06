const { GOOGLE_ID, FACEBOOK_ID, ENTERPRISE_ID } = require("../common/common");
import enterpriseFederatedAuthenticators from '../../../components/data/templates/enterprise-identity-provider.json';
import facebookFederatedAuthenticators from '../../../components/data/templates/facebook.json';
import googleFederatedAuthenticators from '../../../components/data/templates/google.json';

function selectedTemplateBaesedonTemplateId(templateId) {
    switch (templateId) {
        case GOOGLE_ID:

            return googleFederatedAuthenticators;
        case FACEBOOK_ID:

            return facebookFederatedAuthenticators;
        case ENTERPRISE_ID:

            return enterpriseFederatedAuthenticators;
        default:

            return null;
    }
}

module.exports = {
    selectedTemplateBaesedonTemplateId
}