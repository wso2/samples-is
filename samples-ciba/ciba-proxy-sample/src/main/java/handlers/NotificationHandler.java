/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package handlers;

import configuration.ConfigurationFile;
import dao.ArtifactStoreConnectors;
import dao.DaoFactory;
import transactionartifacts.PollingAtrribute;

/**
 * Handles the process of sending client notifications.
 */
public class NotificationHandler implements Handlers {

    ArtifactStoreConnectors artifactStoreConnectors =
            DaoFactory.getInstance().getArtifactStoreConnector(ConfigurationFile.
                    getInstance().getSTORE_CONNECTOR_TYPE());

    private NotificationHandler() {

    }

    private static NotificationHandler notificationHandlerInstance = new NotificationHandler();

    public static NotificationHandler getInstance() {

        if (notificationHandlerInstance == null) {

            synchronized (NotificationHandler.class) {

                if (notificationHandlerInstance == null) {

                    /* instance will be created at request time */
                    notificationHandlerInstance = new NotificationHandler();
                }
            }
        }
        return notificationHandlerInstance;

    }

    /**
     * Send notification to client.
     *
     * @param authReqId Authentication request identifier.
     */
    public void sendNotificationtoClient(String authReqId) {

        if (setNotificationFlag(authReqId)) {
            // Do nothing for the moment.
        }
    }

    /**
     * Set the notification flag.
     *
     * @param authReqId Authentication request identifier.
     * @return Boolean if setting process is success.
     */
    private Boolean setNotificationFlag(String authReqId) {

        PollingAtrribute pollingAtrribute1 = artifactStoreConnectors.getPollingAttribute(authReqId);
        artifactStoreConnectors.removePollingAttribute(authReqId);
        pollingAtrribute1.setNotificationIssued(true);

        artifactStoreConnectors.addPollingAttribute(authReqId, pollingAtrribute1);
        return true;
    }

}
