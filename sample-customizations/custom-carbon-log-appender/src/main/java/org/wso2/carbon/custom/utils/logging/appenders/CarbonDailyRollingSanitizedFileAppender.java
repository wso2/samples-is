/*
*  Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
*  WSO2 Inc. licenses this file to you under the Apache License,
*  Version 2.0 (the "License"); you may not use this file except
*  in compliance with the License.
*  You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
package org.wso2.carbon.custom.utils.logging.appenders;

import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.spi.LoggingEvent;
import org.wso2.carbon.bootstrap.logging.LoggingBridge;
import org.wso2.carbon.context.CarbonContext;
import org.wso2.carbon.utils.logging.LoggingUtils;
import org.wso2.carbon.utils.logging.TenantAwareLoggingEvent;

import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.logging.LogRecord;

public class CarbonDailyRollingSanitizedFileAppender extends DailyRollingFileAppender implements LoggingBridge {

    public void push(LogRecord record) {
        LoggingEvent loggingEvent = LoggingUtils.getLogEvent(record);
        doAppend(loggingEvent);
    }

    /**
     * This overridden method takes a Logging event, get it wrapped with tenant information taken
     * from PrivilegedCarbonContext (by utilizing LoggingUtils.getTenantAwareLogEvent) and passes
     * the TenantAwareLoggingEvent to super class.
     * <p/>
     * The passed TenantAwareLoggingEvent is later used in TenantAwareNamedPatternConverter to
     * extract the required tenant information as well as other logging information.
     *
     * @param loggingEvent
     *         - the logging event without tenant information
     */
    @Override
    protected void subAppend(LoggingEvent loggingEvent) {

        int tenantId = AccessController.doPrivileged(new PrivilegedAction<Integer>() {
            public Integer run() {
                return CarbonContext.getThreadLocalCarbonContext().getTenantId();
            }
        });

        String serviceName = CarbonContext.getThreadLocalCarbonContext().getApplicationName();

        final LoggingEvent newLoggingEvent = new LoggingEvent(loggingEvent.getFQNOfLoggerClass(), loggingEvent.getLogger(),
                loggingEvent.getTimeStamp(), loggingEvent.getLevel(),
                getSanitizedLoggingMessage(loggingEvent.getMessage()),
                loggingEvent.getThreadName(), loggingEvent.getThrowableInformation(),
                loggingEvent.getNDC(), loggingEvent.getLocationInformation(),
                loggingEvent.getProperties());

        // acquire the tenant aware logging event from the logging event
        final TenantAwareLoggingEvent tenantAwareLoggingEvent = LoggingUtils
                .getTenantAwareLogEvent(newLoggingEvent, tenantId, serviceName);

        AccessController.doPrivileged(new PrivilegedAction<Void>() {
            public Void run() {
                CarbonDailyRollingSanitizedFileAppender.super.subAppend(tenantAwareLoggingEvent);
                return null; // nothing to return
            }
        });
    }

    /**
     * Returns a String instance sanitized for CR and LF characters if present in the original message
     *
     * @param message original message
     * @return a sanitized String
     */
    private static String getSanitizedLoggingMessage(Object message) {

        String sanitizedMessage = message == null ? null : message.toString();
        if (sanitizedMessage != null && !sanitizedMessage.isEmpty()) {
            boolean sanitized = false;
            int index = sanitizedMessage.indexOf('\r');
            if (index >= 0) {
                sanitizedMessage = sanitizedMessage.replace('\r', '_');
                sanitized = true;
            }

            index = sanitizedMessage.indexOf('\n');
            if (index >= 0) {
                sanitizedMessage = sanitizedMessage.replace('\n', '_');
                sanitized = true;
            }

            if (sanitized){
                sanitizedMessage = sanitizedMessage.concat(" (Sanitized)");
            }
        }

        return sanitizedMessage;
    }
}
