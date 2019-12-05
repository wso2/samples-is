package dao;

import cache.DeviceFlowProxyCache;

public class CacheConnector implements DbConnectors {

    private DeviceFlowProxyCache deviceFlowProxyCache;

    private CacheConnector() {

        deviceFlowProxyCache = DeviceFlowProxyCache.getDeviceFlowProxyCache();
    }

    private static CacheConnector cacheConnector = new CacheConnector();

    static CacheConnector getInstance() {

        if (cacheConnector == null) {

            synchronized (CacheConnector.class) {

                if (cacheConnector == null) {

                    /* instance will be created at request time */
                    cacheConnector = new CacheConnector();
                }
            }
        }
        return cacheConnector;
    }

    public void addAuthRequest(String AuthId, String ClientId) {

        deviceFlowProxyCache.getAuthRequestCache().add(AuthId, ClientId);
    }

    public void addDeviceCodeCache(String AuthId, String DeviceCode) {

        deviceFlowProxyCache.getDeviceAuthResponseCache().addDeviceCode(AuthId, DeviceCode);
    }

    public void addUserCodeCache(String AuthId, String UserCode) {

        deviceFlowProxyCache.getDeviceAuthResponseCache().addUserCode(AuthId, UserCode);
    }

    public void addVerificationURICache(String AuthId, String VerificationURI) {

        deviceFlowProxyCache.getDeviceAuthResponseCache().getVerificationURI(AuthId, VerificationURI);
    }

    public void addExpiresInCache(String AuthId, Long ExpiresIn) {

        deviceFlowProxyCache.getDeviceAuthResponseCache().addExpiresIn(AuthId, ExpiresIn);
    }

    public void addInterval(String AuthId, String Interval) {

    }

    @Override
    public String getDeviceCodeCache(String AuthId) {

        return deviceFlowProxyCache.getDeviceAuthResponseCache().getDeviceCode(AuthId);
//        return null;
    }

    @Override
    public String getUserCodeCache(String AuthId) {

        return deviceFlowProxyCache.getDeviceAuthResponseCache().getUserCode(AuthId);
    }

    @Override
    public Long getExpiresInCache(String AuthId) {

        return deviceFlowProxyCache.getDeviceAuthResponseCache().getExpiresIn(AuthId);
    }

    @Override
    public void addTokenCache(String ClientId, String Token) {

        deviceFlowProxyCache.getTokenResponseCache().addToken(ClientId, Token);
    }

    @Override
    public String getTokenCache(String ClientId) {

        return deviceFlowProxyCache.getTokenResponseCache().getToken(ClientId);
    }

}
