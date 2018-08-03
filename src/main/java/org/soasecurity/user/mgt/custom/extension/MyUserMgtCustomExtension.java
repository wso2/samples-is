package org.soasecurity.user.mgt.custom.extension;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.user.core.common.AbstractUserOperationEventListener;

/**
 *
 */
public class MyUserMgtCustomExtension extends AbstractUserOperationEventListener {

    private static Log log = LogFactory.getLog(MyUserMgtCustomExtension.class);

    @Override
    public int getExecutionOrderId() {
        return 9883;
    }


    @Override
    public boolean doPreAuthenticate(String userName, Object credential,
                                     UserStoreManager userStoreManager) throws UserStoreException {

        // just log
        log.info("doPreAuthenticate method is called before authenticating with user store");

        return true;
    }

    @Override
    public boolean doPostAuthenticate(String userName, boolean authenticated, UserStoreManager userStoreManager) throws UserStoreException {


        // just log
        log.info("doPreAuthenticate method is called after authenticating with user store");

        // custom logic

        // check whether user is authenticated
        if (authenticated) {

            // persist user attribute in to user store
            // "http://wso2.org/claims/lastlogontime" is the claim uri which represent the LDAP attribute
            //  more detail about claim management from here http://soasecurity.org/2012/05/02/claim-management-with-wso2-identity-server/

            userStoreManager.setUserClaimValue(userName, "http://wso2.org/claims/lastlogontime",
                    Long.toString(System.currentTimeMillis()), null);

        }

        return true;

    }

}
