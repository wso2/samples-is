/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.wso2.extension.siddhi.execution.geovelocity;

import org.wso2.extension.siddhi.execution.geovelocity.api.GeoVelocityData;
import org.wso2.extension.siddhi.execution.geovelocity.api.GeoVelocityDataResolver;
import org.wso2.extension.siddhi.execution.geovelocity.internal.exception.GeoVelocityException;
import org.wso2.extension.siddhi.execution.geovelocity.internal.impl.GeoVelocityDataResolverHolder;
import org.wso2.siddhi.annotation.Example;
import org.wso2.siddhi.annotation.Extension;
import org.wso2.siddhi.annotation.Parameter;
import org.wso2.siddhi.annotation.ReturnAttribute;
import org.wso2.siddhi.annotation.util.DataType;
import org.wso2.siddhi.core.config.SiddhiAppContext;
import org.wso2.siddhi.core.executor.ExpressionExecutor;
import org.wso2.siddhi.core.executor.function.FunctionExecutor;
import org.wso2.siddhi.core.util.config.ConfigReader;
import org.wso2.siddhi.query.api.definition.Attribute;
import org.wso2.siddhi.query.api.exception.SiddhiAppValidationException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * This class is to get the risk of login based on the user's login behaviour.
 */
@Extension(
        name = "loginBehaviourBasedRisk",
        namespace = "geovelocity",
        description = "Returns the calculated login behaviour based risk" +
                "considering the location and the time of the login",
        parameters = {
                @Parameter(
                        name = "username",
                        description = "User's username",
                        type = {DataType.STRING}),
                @Parameter(
                        name = "city",
                        description = "User's current login city",
                        type = {DataType.STRING}),
                @Parameter(
                        name = "currentlogintime",
                        description = "timestamp of current login",
                        type = {DataType.LONG})
        },
        returnAttributes =
        @ReturnAttribute(
                description = "Returns the login behaviour based calculated risk" +
                        "considering the location and the time of the login." +
                        "The range of the risk value is 0 to 1.",
                type = {DataType.DOUBLE}),
        examples = @Example(
                description = "This will return the login behaviour based risk " +
                        "considering the location and the time of the login. " +
                        "Assume Alex last login from New York was yesterday, and he tries to " +
                        "login to the system today, then his login Behaviour based risk is low. But if he tries to " +
                        "login to the system 1 year back, then his login behaviour is high. ",
                syntax = "define stream GeovelocityStream(username string, city string," +
                        "currentlogintime string);\n" +
                        "from GeovelocityStream\n" +
                        "select geovelocity:loginBehaviourBasedRisk(username, city," +
                        "currentlogintime) as loginbehaviourbasedrisk \n" +
                        "insert into outputStream;")
)
public class GetLoginBehaviourRisk extends FunctionExecutor {

    private static final String DEFAULT_GEOVELOCITY_RESOLVER_CLASSNAME =
            "org.wso2.extension.siddhi.execution.geovelocity.internal.impl.DefaultDBBasedGeoVelocityDataResolver";
    private static GeoVelocityDataResolver geoVelocityDataResolverImpl;

    @Override
    protected void init(ExpressionExecutor[] attributeExpressionExecutors, ConfigReader configReader,
                        SiddhiAppContext siddhiAppContext) {

        initializeExtensionConfigs(configReader);
        if (attributeExpressionExecutors.length != 3) {
            throw new SiddhiAppValidationException("Invalid no of arguments passed to geovelocity:loginbehaviourrisk" +
                    " function, required 3, but found " + attributeExpressionExecutors.length);
        }
        Attribute.Type attributeType = attributeExpressionExecutors[0].getReturnType();
        if (attributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for first argument username of " +
                    "geovelocity:loginbehaviourbasedrisk() function, required " + Attribute.Type.STRING + ", but found "
                    + attributeType.toString());
        }
        Attribute.Type secondAttributeType = attributeExpressionExecutors[1].getReturnType();
        if (secondAttributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for second argument city of " +
                    "geovelocity:loginbehaviourbasedrisk() function, required " + Attribute.Type.STRING + ", but found "
                    + secondAttributeType.toString());
        }
        Attribute.Type thirdaAttributeType = attributeExpressionExecutors[2].getReturnType();
        if (thirdaAttributeType != Attribute.Type.LONG) {
            throw new SiddhiAppValidationException("Invalid parameter type found for third argument " +
                    "currentlogintime of geovelocity:loginbehaviourbasedrisk() function, required "
                    + Attribute.Type.LONG + ", but found " + thirdaAttributeType.toString());
        }
    }

    @Override
    protected Object execute(Object[] data) {

        String username = data[0].toString();
        String city = data[1].toString();
        Long currentLoginTime = Long.parseLong(data[2].toString());
        GeoVelocityData geoVelocityData = geoVelocityDataResolverImpl.getGeoVelocityInfo(username, city);
        Long lastLoginTime = geoVelocityData.getLoginBehaviourBasedRisk();
        double risk;
        if (lastLoginTime != 0L) {
            // Time difference is converted to days.
            long timeDifference = TimeUnit.MILLISECONDS.toDays(currentLoginTime - lastLoginTime);
            // Risk was calculated by using the formula of (1 - e^(-t)). t = Time difference.
            risk = 1 - Math.pow(Math.E, -timeDifference);
        } else {
            risk = 0.5;
        }
        return risk;
    }

    @Override
    protected Object execute(Object data) {

        return null;
    }

    @Override
    public Attribute.Type getReturnType() {

        return Attribute.Type.DOUBLE;
    }

    @Override
    public Map<String, Object> currentState() {

        return null;
    }

    @Override
    public void restoreState(Map<String, Object> state) {

    }

    private void initializeExtensionConfigs(ConfigReader configReader) throws SiddhiAppValidationException {

        String geovelocityResolverImplClassName = configReader.readConfig("geoVelocityResolverClass",
                DEFAULT_GEOVELOCITY_RESOLVER_CLASSNAME);
        try {
            geoVelocityDataResolverImpl = GeoVelocityDataResolverHolder.getGeoVelocityResolverHolderInstance().
                    getGeoVelocityDataResolver(geovelocityResolverImplClassName);
            geoVelocityDataResolverImpl.init(configReader);
        } catch (GeoVelocityException e) {
            throw new SiddhiAppValidationException("Cannot initialize " +
                    "GeoVelocityDataResolver implementation class '"
                    + geovelocityResolverImplClassName + "' given in the configuration", e);
        } catch (InstantiationException e) {
            throw new SiddhiAppValidationException("Cannot instantiate GeoCoordinateResolverHolder holder class '"
                    + geovelocityResolverImplClassName , e);
        } catch (IllegalAccessException e) {
            throw new SiddhiAppValidationException("Cannot access GeoCoordinateResolverHolder holder class '"
                    + geovelocityResolverImplClassName , e);
        } catch (ClassNotFoundException e) {
            throw new SiddhiAppValidationException("Cannot find GeoCoordinateResolverHolder holder class '"
                    + geovelocityResolverImplClassName , e);
        }
    }
}
