package org.wso2.carbon.identity.customhandler.handler;

import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.base.IdentityRuntimeException;
import org.wso2.carbon.identity.core.bean.context.MessageContext;
import org.wso2.carbon.identity.core.handler.InitConfig;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.customhandler.internal.CustomUserSelfRegistrationHandlerDataHolder;
import org.wso2.carbon.identity.event.IdentityEventConstants;
import org.wso2.carbon.identity.event.IdentityEventException;
import org.wso2.carbon.identity.event.event.Event;
import org.wso2.carbon.identity.event.handler.AbstractEventHandler;
import org.wso2.carbon.identity.recovery.IdentityRecoveryConstants;
import org.wso2.carbon.identity.recovery.IdentityRecoveryServerException;
import org.wso2.carbon.identity.recovery.util.Utils;
import org.wso2.carbon.user.api.UserStoreException;
import org.wso2.carbon.user.api.UserStoreManager;
import org.wso2.carbon.user.core.service.RealmService;

import java.util.List;

import static java.util.Arrays.asList;

public class CustomUserSelfRegistrationHandler extends AbstractEventHandler {

    //Role Constants
    public static final String SUBSCRIBER_ROLE = "Internal/Subscriber";
    public static final String SELF_SIGNUP_ROLE = "Internal/selfsignup";

    @Override
    public String getName() {

        return "customUserSelfRegistration";
    }

    public void handleEvent(Event event) throws IdentityEventException {

        if (IdentityEventConstants.Event.POST_ADD_USER.equals(event.getEventName())) {

            String tenantDomain = (String) event.getEventProperties()
                    .get(IdentityEventConstants.EventProperty.TENANT_DOMAIN);
            String userName = (String) event.getEventProperties().get(IdentityEventConstants.EventProperty.USER_NAME);

            //The handler should be called ss a post add user event.
            try {
                addNewRole(tenantDomain, userName);
            } catch (IdentityRecoveryServerException e) {
                throw new IdentityEventException("Error while adding custom roles to the user", e);
            }
        }
    }

    private void addNewRole(String tenantDomain, String userName)
            throws org.wso2.carbon.identity.recovery.IdentityRecoveryServerException {

        try {
            //Realm service is used for user management tasks
            RealmService realmService = CustomUserSelfRegistrationHandlerDataHolder.getInstance().getRealmService();
            UserStoreManager userStoreManager;
            try {
                userStoreManager = realmService.getTenantUserRealm(IdentityTenantUtil.getTenantId(tenantDomain))
                        .getUserStoreManager();
            } catch (UserStoreException e) {
                throw Utils
                        .handleServerException(IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_UNEXPECTED, userName,
                                e);
            }
            //Start a tenant flow
            PrivilegedCarbonContext.startTenantFlow();
            PrivilegedCarbonContext carbonContext = PrivilegedCarbonContext.getThreadLocalCarbonContext();
            carbonContext.setTenantId(IdentityTenantUtil.getTenantId(tenantDomain));
            carbonContext.setTenantDomain(tenantDomain);
            try {
                //Since this handler is called as a post add user event, the user should exists in the userstore
                if (userStoreManager.isExistingUser(userName)) {
                    List<String> roleList = asList(userStoreManager.getRoleListOfUser(userName));
                    //User should have selfSignup role. Checking whether the user is in the new role
                    if (roleList.contains(SELF_SIGNUP_ROLE) && !roleList.contains(SUBSCRIBER_ROLE)) {
                        String[] userRoles = new String[]{SUBSCRIBER_ROLE};
                        userStoreManager.updateRoleListOfUser(userName, null, userRoles);
                    }
                }
            } catch (UserStoreException e) {
                throw Utils
                        .handleServerException(IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_UNEXPECTED, userName,
                                e);
            }
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
        }
    }

    @Override
    public void init(InitConfig configuration) throws IdentityRuntimeException {

        super.init(configuration);
    }

    @Override
    public int getPriority(MessageContext messageContext) {

        return 250;
    }
}
