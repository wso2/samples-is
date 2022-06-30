package org.wso2.sample.scope.validator.internal;

import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.user.core.service.RealmService;

public class CustomScopeValidatorDataHolder {

    private static CustomScopeValidatorDataHolder instance = new CustomScopeValidatorDataHolder();

    private RealmService realmService;
    private RegistryService registryService;

    private CustomScopeValidatorDataHolder() {

    }

    public static CustomScopeValidatorDataHolder getInstance() {
        return instance;
    }

    public RealmService getRealmService() {
        return realmService;
    }

    public void setRealmService(RealmService realmService) {
        this.realmService = realmService;
    }

    public RegistryService getRegistryService() {
        return registryService;
    }

    public void setRegistryService(RegistryService registryService) {
        this.registryService = registryService;
    }

}
