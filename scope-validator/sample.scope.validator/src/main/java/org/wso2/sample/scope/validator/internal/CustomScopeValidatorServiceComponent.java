package org.wso2.sample.scope.validator.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.identity.oauth2.validators.scope.ScopeValidator;
import org.wso2.carbon.user.core.service.RealmService;
import org.wso2.sample.scope.validator.CustomScopeValidator;

/**
 * Custom Scope Validator Component.
 */
@Component(
        name = "custom.scope.validator.component",
        immediate = true
)
public class CustomScopeValidatorServiceComponent {

    private static Log log = LogFactory.getLog(CustomScopeValidatorServiceComponent.class);

    @Activate
    protected void activate(ComponentContext ctxt) {

        ctxt.getBundleContext().registerService(ScopeValidator.class, new CustomScopeValidator(), null);
        log.info("CustomUserStoreManager bundle activated successfully..");
    }

    @Deactivate
    protected void deactivate(ComponentContext ctxt) {

        if (log.isDebugEnabled()) {
            log.debug("Custom User Store Manager is deactivated ");
        }
    }

    @Reference(
            name = "user.realmservice.default",
            service = RealmService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRealmService"
    )
    protected void setRealmService(RealmService rlmService) {

        CustomScopeValidatorDataHolder.getInstance().setRealmService(rlmService);
    }

    protected void unsetRealmService(RealmService realmService) {

        CustomScopeValidatorDataHolder.getInstance().setRealmService(null);
    }

}
