package dao;

public class DaoFactory implements DbConnectors {

    private static DaoFactory daoFactory = new DaoFactory();

    public static DaoFactory getInstance() {

        if (daoFactory == null) {

            synchronized (DaoFactory.class) {

                if (daoFactory == null) {

                    /* instance will be created at request time */
                    daoFactory = new DaoFactory();
                }
            }
        }
        return daoFactory;
    }

    public DbConnectors getConnector(String name) {

        if (name.equalsIgnoreCase("InMemoryCache")) {
            return CacheConnector.getInstance();
            //return new CacheConnector();
        }
        return null;
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
