/*
 *  Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.xacmlinfo.xacml.pip.jdbc;

import org.wso2.carbon.identity.entitlement.pip.AbstractPIPAttributeFinder;

import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

/**
 * This is sample implementation of PIPAttributeFinder in WSO2 entitlement engine. Here we are
 * calling to an external user base to find given attribute; Assume that user store is reside on mysql
 * database
 */
public class KMarketJDBCAttributeFinder extends AbstractPIPAttributeFinder {

    
    private static final String GROUP_ID = "http://kmarket.com/id/group";

    private static final String POINT_ID = "http://kmarket.com/id/point";

    private static final String EMAIL_ID = "http://kmarket.com/id/email";

	/**
	 * Connection pool is used to create connection to database
	 */
	private DataSource dataSource;

	/**
	 * List of attribute finders supported by the this PIP attribute finder
	 */
	private Set<String> supportedAttributes = new HashSet<String>();

    @Override
	public void init(Properties properties)  throws Exception{
        
        String dataSourceName = (String) properties.get("DataSourceName");

        if(dataSourceName == null || dataSourceName.trim().length() == 0){
            throw new Exception("Data source name can not be null. Please configure it in the entitlement.properties file.");
        }

        dataSource = (DataSource) InitialContext.doLookup(dataSourceName);

        supportedAttributes.add(GROUP_ID);
        supportedAttributes.add(POINT_ID);
        supportedAttributes.add(EMAIL_ID);
    }

    @Override
    public String getModuleName() {
        return "K-Market Attribute Finder";
    }

    @Override
    public Set<String> getAttributeValues(String subjectId, String resourceId, String actionId,
                                          String environmentId, String attributeId, String issuer) throws Exception{

		String attributeName = null;

        if(GROUP_ID.equals(attributeId)){
            attributeName = "privilege";
        } else if(POINT_ID.equals(attributeId)){
            attributeName = "point";
        } else if(EMAIL_ID.equals(attributeId)){
            attributeName = "email";
        }

        if(attributeName == null){
            throw new Exception("Invalid attribute id : " + attributeId);
        }

        /**
		 * SQL statement to retrieve attribute value for given attribute id from database
		 */
		String sqlStmt = "select ATTRIBUTE_VALUE from UM_USER_ATTRIBUTE where ATTRIBUTE_NAME='"
				+ attributeName + "' and USER_ID=(select USER_ID from UM_USER where USER_NAME='"
				+ subjectId + "');";

		Set<String> values = new HashSet<String>();
		PreparedStatement prepStmt = null;
		ResultSet resultSet = null;
		Connection connection = null;

		try {
			connection = dataSource.getConnection();
			if (connection != null) {
				prepStmt = connection.prepareStatement(sqlStmt);
				resultSet = prepStmt.executeQuery();
				while (resultSet.next()) {
					values.add(resultSet.getString(1));
				}
			}
		} catch (SQLException e) {
			throw new Exception("Error while retrieving attribute values", e);
		}finally {
            try{
                if(resultSet != null){
                    resultSet.close();
                }
                if(prepStmt != null){
                    prepStmt.close();
                }
                if(connection !=  null){
                    connection.close();
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }

		return values;
	}
    
    @Override
	public Set<String> getSupportedAttributes() {
		return supportedAttributes;
	}
}
