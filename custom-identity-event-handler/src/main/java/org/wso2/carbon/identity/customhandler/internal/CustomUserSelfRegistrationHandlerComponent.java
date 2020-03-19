package org.wso2.carbon.identity.customhandler.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.identity.event.handler.AbstractEventHandler;
import org.wso2.carbon.identity.customhandler.handler.CustomUserSelfRegistrationHandler;
import org.wso2.carbon.user.core.service.RealmService;

/**
 * @scr.component name="org.wso2.carbon.identity.customhandler.internal.CustomUserSelfRegistrationHandlerComponent" immediate="true"
 * @scr.reference name="realm.service"
 * interface="org.wso2.carbon.user.core.service.RealmService" cardinality="1..1"
 * policy="dynamic" bind="setRealmService" unbind="unsetRealmService"
 */
public class CustomUserSelfRegistrationHandlerComponent {

    private static Log log = LogFactory.getLog(CustomUserSelfRegistrationHandlerComponent.class);
    private CustomUserSelfRegistrationHandlerDataHolder dataHolder = CustomUserSelfRegistrationHandlerDataHolder
            .getInstance();

    protected void activate(ComponentContext context) {
        try {
            BundleContext bundleContext = context.getBundleContext();
            bundleContext.registerService(AbstractEventHandler.class.getName(), new CustomUserSelfRegistrationHandler(),
                    null);
        } catch (Exception e) {
            log.error("Error while activating custom User selfRegistration handler component.", e);
        }
    }

    protected void deactivate(ComponentContext context) {
        if (log.isDebugEnabled()) {
            log.debug("custom self registration handler is de-activated");
        }
    }

    protected void setRealmService(RealmService realmService) {
        if (log.isDebugEnabled()) {
            log.debug("Setting the Realm Service");
        }
        dataHolder.setRealmService(realmService);
    }

    protected void unsetRealmService(RealmService realmService) {
        log.debug("UnSetting the Realm Service");
        dataHolder.setRealmService(null);
    }
}

