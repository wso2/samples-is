package org.wso2.carbon.identity.customhandler.internal;

import org.wso2.carbon.user.core.service.RealmService;

public class CustomUserSelfRegistrationHandlerDataHolder {

    private static CustomUserSelfRegistrationHandlerDataHolder instance = new CustomUserSelfRegistrationHandlerDataHolder();
    private RealmService realmService;

    public static CustomUserSelfRegistrationHandlerDataHolder getInstance() {
        return instance;
    }

    public RealmService getRealmService() {
        return realmService;
    }

    public void setRealmService(RealmService realmService) {
        this.realmService = realmService;
    }

}
