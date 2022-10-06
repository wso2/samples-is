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

function checkIfIdpIsinAuthSequence(template, idpDetails) {
    let authenticationSequenceModel = template.authenticationSequence;
    let idpName = idpDetails.name;
    let check = false;

    authenticationSequenceModel.steps.map((step) => {
        step.options.map((option) => {
            if (option.idp === idpName) {
                check = true;
            }
        });
    });

    return check;
}

/**
 * PatchApplicationAuthMethod mentioned whether we are adding or removing the idp.
 * @REMOVE Will remove the idp from every step
 */
const PatchApplicationAuthMethod = {
    ADD: true,
    REMOVE: false
}

module.exports = {
    selectedTemplateBaesedonTemplateId, checkIfIdpIsinAuthSequence, PatchApplicationAuthMethod
}
