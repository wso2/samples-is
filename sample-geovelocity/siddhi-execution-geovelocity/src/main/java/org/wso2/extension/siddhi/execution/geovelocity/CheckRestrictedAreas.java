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

/**
 * This is a class to get the risk based on restricted area combinations.
 */
@Extension(
        name = "restrictedAreaBasedRisk",
        namespace = "geovelocity",
        description = "Returns risk score based on the restricted area " +
                "combinations considering the previous login and the current login attempt." +
                "Login geo-velocity between restricted area comination is tested.",
        parameters = {
                @Parameter(
                        name = "current.login.city",
                        description = "user's current login city",
                        type = {DataType.STRING}),
                @Parameter(
                        name = "previous.login.city",
                        description = "user's previous login city",
                        type = {DataType.STRING}),
                @Parameter(
                        name = "current.login.country",
                        description = "user's current login country",
                        type = {DataType.STRING}),
                @Parameter(
                        name = "previous.login.country",
                        description = "user's last login country",
                        type = {DataType.STRING})
        },
        returnAttributes =
        @ReturnAttribute(
                description = "Returns risk score based on the restricted area " +
                        "combinations considering the previous login and the current login attempt." +
                        "Risk value which is based on restricted location combination is either 1 or 0." +
                        "If the current and previous login location is according to the predefined " +
                        "restricted location combinations, restricted area based risk value is 1, " +
                        "otherwise it's 0.",
                type = {DataType.INT}),
        examples = @Example(
                description = "This will return risk score based on the restricted area " +
                        "combinations considering the locations of the previous login and the current login" +
                        " attempt. Assume Alex previous login location is South Korea and current login " +
                        "location is North Korea. Since it's defined that it's restricted to travel from " +
                        "South Korea to North Korea, risk is 1",
                syntax = "define stream GeovelocityStream(current.login.city string, " +
                        "previous.login.city string, current.login.country string, previous.login.country string);" +
                        "from GeovelocityStream" +
                        "select geovelocity:restrictedAreaBasedRisk(current.login.city, previous.login.city, " +
                        "current.login.country, previous.login.country) as restrictedareabasedrisk" +
                        "insert into outputStream;")
)

public class CheckRestrictedAreas extends FunctionExecutor {

    private static final String DEFAULT_GEOVELOCITY_RESOLVER_CLASSNAME =
            "org.wso2.extension.siddhi.execution.geovelocity.internal.impl.DefaultDBBasedGeoVelocityDataResolver";
    private static GeoVelocityDataResolver geoVelocityDataResolverImpl;

    @Override
    protected void init(ExpressionExecutor[] attributeExpressionExecutors, ConfigReader configReader,
                        SiddhiAppContext siddhiAppContext) {

        initializeExtensionConfigs(configReader);
        if (attributeExpressionExecutors.length != 4) {
            throw new SiddhiAppValidationException("Invalid no of arguments passed to " +
                    "geovelocity:restrictedareabasedrisk function, required 4, but found "
                    + attributeExpressionExecutors.length);
        }
        Attribute.Type attributeType = attributeExpressionExecutors[0].getReturnType();
        if (attributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for first " +
                    "argument current.login.city of geovelocity:loginbehaviourbasedrisk() function, required "
                    + Attribute.Type.STRING + ", but found " + attributeType.toString());
        }
        Attribute.Type secondAttributeType = attributeExpressionExecutors[1].getReturnType();
        if (secondAttributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for second argument " +
                    "previous.login.city of geovelocity:loginbehaviourbasedrisk() function, required " +
                    Attribute.Type.STRING + ", but found " + secondAttributeType.toString());
        }
        Attribute.Type thirdAttributeType = attributeExpressionExecutors[2].getReturnType();
        if (thirdAttributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for third argument " +
                    "current.login.country of geovelocity:loginbehaviourbasedrisk() function, required "
                    + Attribute.Type.STRING + ", but found " + thirdAttributeType.toString());
        }
        Attribute.Type fourthAttributeType = attributeExpressionExecutors[3].getReturnType();
        if (fourthAttributeType != Attribute.Type.STRING) {
            throw new SiddhiAppValidationException("Invalid parameter type found for fourth argument " +
                    "previous.login.country of geovelocity:loginbehaviourbasedrisk() function, required "
                    + Attribute.Type.STRING + ", but found " + fourthAttributeType.toString());
        }
    }

    @Override
    protected Object execute(Object[] data) {

        GeoVelocityData geoVelocityData;
        geoVelocityData = geoVelocityDataResolverImpl.checkLoginLocationValidity
                (data[0].toString(), data[1].toString(), data[2].toString(), data[3].toString());
        return geoVelocityData.checkSuspiciousLogin();
    }

    @Override
    protected Object execute(Object data) {
        return null;
    }

    @Override
    public Attribute.Type getReturnType() {
        return Attribute.Type.INT;
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
            throw new SiddhiAppValidationException("Cannot instantiate GeoCoordinateResolverHolder holder class: "
                    + geovelocityResolverImplClassName , e);
        } catch (IllegalAccessException e) {
            throw new SiddhiAppValidationException("Cannot access GeoCoordinateResolverHolder holder class: "
                    + geovelocityResolverImplClassName , e);
        } catch (ClassNotFoundException e) {
            throw new SiddhiAppValidationException("Cannot find GeoCoordinateResolverHolder holder class: "
                    + geovelocityResolverImplClassName , e);
        }
    }
}
