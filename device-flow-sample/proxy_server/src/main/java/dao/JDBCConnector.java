package dao;

import jdbc.DeviceFlowProxyJDBC;

public class JDBCConnector implements DbConnectors {

    private DeviceFlowProxyJDBC deviceFlowProxyJDBC;

    private JDBCConnector(){
        deviceFlowProxyJDBC = DeviceFlowProxyJDBC.getDeviceFlowJDBC();
    }

    private static JDBCConnector jdbcConnector = new JDBCConnector();

    static JDBCConnector getInstance() {

        if (jdbcConnector == null) {

            synchronized (JDBCConnector.class) {

                if (jdbcConnector == null) {

                    /* instance will be created at request time */
                    jdbcConnector = new JDBCConnector();
                }
            }
        }
        return jdbcConnector;
    }

    @Override
    public void addAuthRequest(String AuthId, String ClientId) {

    }

    @Override
    public void addDeviceCodeCache(String AuthId, String DeviceCode) {

    }

    @Override
    public void addUserCodeCache(String AuthId, String UserCode) {

    }

    @Override
    public void addVerificationURICache(String AuthId, String VerificationURI) {

    }

    @Override
    public void addExpiresInCache(String AuthId, Long ExpiresIn) {

    }

    @Override
    public void addInterval(String AuthId, String Interval) {

    }

    @Override
    public String getDeviceCodeCache(String AuthId) {

        return null;
    }

    @Override
    public String getUserCodeCache(String AuthId) {

        return null;
    }

    @Override
    public Long getExpiresInCache(String AuthId) {

        return null;
    }

    @Override
    public void addTokenCache(String ClientId, String Token) {

    }

    @Override
    public String getTokenCache(String ClientId) {

        return null;
    }
}
