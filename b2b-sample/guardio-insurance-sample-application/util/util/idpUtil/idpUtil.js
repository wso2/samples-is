import config from '../../../config.json';
import { ENTERPRISE_ID, FACEBOOK_ID, GOOGLE_ID } from '../common/common';

function setIdpTemplate(model, templateId, name, clientId, clientSecret) {
    model.name = name;
    console.log(clientId);

    switch (templateId) {
        case FACEBOOK_ID:
            model = facebookIdpTemplate(model, clientId, clientSecret);
            break;
        case GOOGLE_ID:  
            model =  googleIdpTemplate(model, clientId, clientSecret);
            break;
        case ENTERPRISE_ID:
            model =  enterpriseIdpTemplate(model, clientId, clientSecret);
            break;
        default:
            break;
    }

    model.federatedAuthenticators.authenticators[0].isEnabled = true;

    return model;

}

function facebookIdpTemplate(model, clientId, clientSecret) {
    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/facebook-idp-illustration.svg`;

    model.alias = `${config.WSO2IS_HOST}/oauth2/token`;

    model.federatedAuthenticators.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "callbackUrl",
            "value": `${config.WSO2IS_HOST}/commonauth`
        }
    ];

    return model;
}

function googleIdpTemplate(model, clientId, clientSecret) {
    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg`;

    model.alias = `${config.WSO2IS_HOST}/oauth2/token`;

    model.federatedAuthenticators.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "callbackUrl",
            "value": `${config.WSO2IS_HOST}/commonauth`
        },
        {
            "key": "AdditionalQueryParameters",
            "value": "scope=email openid profile"
        }
    ];

    return model;
}

function enterpriseIdpTemplate(model, clientId, clientSecret) {
    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg`;

    model.federatedAuthenticators.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "callBackUrl",
            "value": `${config.WSO2IS_HOST}/commonauth`
        },
        {
            "key": "AdditionalQueryParameters",
            "value": "scope=email openid profile"
        }
    ];

    return model;
}

module.exports = {
    setIdpTemplate
};