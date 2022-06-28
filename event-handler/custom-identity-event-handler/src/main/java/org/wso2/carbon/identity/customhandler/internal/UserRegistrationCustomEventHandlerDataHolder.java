package org.wso2.carbon.identity.customhandler.internal;

import org.wso2.carbon.user.core.service.RealmService;

public class UserRegistrationCustomEventHandlerDataHolder {

    private static UserRegistrationCustomEventHandlerDataHolder instance = new UserRegistrationCustomEventHandlerDataHolder();
    private RealmService realmService;

    public static UserRegistrationCustomEventHandlerDataHolder getInstance() {
        return instance;
    }

    public RealmService getRealmService() {
        return realmService;
    }

    public void setRealmService(RealmService realmService) {
        this.realmService = realmService;
    }

}
