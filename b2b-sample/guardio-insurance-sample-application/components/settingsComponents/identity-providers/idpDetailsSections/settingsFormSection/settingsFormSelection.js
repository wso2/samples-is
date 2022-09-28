import React, { useCallback, useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import FormSuite from 'rsuite/Form';
import { ENTERPRISE_ID, FACEBOOK_ID, GOOGLE_ID } from '../../../../../util/util/common/common';
import enterpriseFederatedAuthenticators from '../../../../data/templates/enterprise-identity-provider.json';
import facebookFederatedAuthenticators from '../../../../data/templates/facebook.json';
import googleFederatedAuthenticators from '../../../../data/templates/google.json';
import HelperText from '../../../../util/helperText';

export default function SettingsFormSelection(props) {

    const [federatedAuthenticators, setFederatedAuthenticators] = useState(props.federatedAuthenticators);

    const propList = () => {
        switch (props.templateId) {
            case GOOGLE_ID:
                return googleFederatedAuthenticators.idp.federatedAuthenticators.authenticators[0].properties;
            case FACEBOOK_ID:
                return facebookFederatedAuthenticators.idp.federatedAuthenticators.authenticators[0].properties;
            case ENTERPRISE_ID:
                return enterpriseFederatedAuthenticators.idp.federatedAuthenticators.authenticators[0].properties;
        }
    };

    const selectedValue = (key) => {
        console.log(federatedAuthenticators);
        return federatedAuthenticators.filter((obj) => obj.key === key)[0].value;
    }
    return (
        <>
            {
                propList().map((prop) => (
                    <Field
                        name={prop.key}
                        defaultValue={selectedValue(prop.key)}
                        render={({ input, meta }) => (
                            <FormSuite.Group controlId={prop.key}>
                                <FormSuite.ControlLabel>{prop.displayName}</FormSuite.ControlLabel>

                                <FormSuite.Control
                                    {...input}
                                />

                                <HelperText
                                    text={prop.description} />

                                {meta.error && meta.touched && <FormSuite.ErrorMessage show={true}  >
                                    {meta.error}
                                </FormSuite.ErrorMessage>}
                            </FormSuite.Group>
                        )}
                    />
                ))
            }
        </>
    )
}

