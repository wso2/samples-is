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
package org.wso2.extension.siddhi.execution.geovelocity.internal.utils;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;
import org.wso2.carbon.datasource.core.api.DataSourceService;
import org.wso2.carbon.datasource.core.exception.DataSourceException;
import org.wso2.extension.siddhi.execution.geovelocity.internal.exception.GeoVelocityException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;

/**
 * This class provides Database Util functionality.
 */
public class DatabaseUtils {

    private static final DatabaseUtils instance = new DatabaseUtils();
    private static final Log log = LogFactory.getLog(DatabaseUtils.class);

    private DataSource dataSource = null;
    private String dataSourceName;

    private DatabaseUtils() {

    }

    public static DatabaseUtils getInstance() {

        return instance;
    }

    public void initialize(String dataSourceName) throws GeoVelocityException {

        try {
            BundleContext bundleContext = FrameworkUtil.getBundle(DataSourceService.class).getBundleContext();
            ServiceReference<DataSourceService> serviceRef = bundleContext.
                    getServiceReference(DataSourceService.class);
            if (serviceRef == null) {
                throw new GeoVelocityException("Cannot find the datasourceService '" +
                        DataSourceService.class.getName() + "'");
            } else {
                DataSourceService dataSourceService = bundleContext.getService(serviceRef);
                dataSource = (HikariDataSource) dataSourceService.getDataSource(dataSourceName);
                if (log.isDebugEnabled()) {
                    log.debug("Lookup for datasource '" + dataSourceName + "' completed through " +
                            "DataSource Service lookup.");
                }
            }
        } catch (DataSourceException e) {
            throw new GeoVelocityException("Cannot connect to the datasource '" + dataSourceName + "'", e);
        }
    }

    /**
     * Utility method to get a new database connection.
     *
     * @return Connection
     * @throws SQLException if failed to get Connection
     */
    public Connection getConnection() throws SQLException {

        if (dataSource != null) {
            return dataSource.getConnection();
        }
        throw new SQLException("Data source is not configured properly.");
    }

    /**
     * Utility method to close the connection streams.
     *
     * @param preparedStatement PreparedStatement
     * @param connection        Connection
     * @param resultSet         ResultSet
     */
    public void closeAllConnections(PreparedStatement preparedStatement, Connection connection,
                                    ResultSet resultSet) {

        closeResultSet(resultSet);
        closeStatement(preparedStatement);
        closeConnection(connection);
    }

    /**
     * Close Connection.
     *
     * @param dbConnection Connection
     */
    private void closeConnection(Connection dbConnection) {

        if (dbConnection != null) {
            try {
                dbConnection.close();
            } catch (SQLException e) {
                log.error("Couldn't close connection", e);
            }
        }
    }

    /**
     * Close ResultSet.
     *
     * @param resultSet ResultSet
     */
    private void closeResultSet(ResultSet resultSet) {

        if (resultSet != null) {
            try {
                resultSet.close();
            } catch (SQLException e) {
                log.error("Couldn't close ResultSet", e);
            }
        }
    }

    /**
     * Close PreparedStatement.
     *
     * @param preparedStatement PreparedStatement
     */
    private void closeStatement(Statement preparedStatement) {

        if (preparedStatement != null) {
            try {
                preparedStatement.close();
            } catch (SQLException e) {
                log.error("Couldn't close Statement", e);
            }
        }
    }
}
