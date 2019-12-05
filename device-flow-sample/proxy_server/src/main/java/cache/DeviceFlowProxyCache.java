package cache;

public class DeviceFlowProxyCache {

    private DeviceAuthReqCache deviceAuthReqCache;
    private DeviceAuthResponseCache deviceAuthResponseCache;
    private TokenResponseCache tokenResponseCache;

    private DeviceFlowProxyCache() {

        deviceAuthReqCache = DeviceAuthReqCache.getInstance();
        deviceAuthResponseCache = DeviceAuthResponseCache.getInstance();
        tokenResponseCache = TokenResponseCache.getInstance();
    }

    private static DeviceFlowProxyCache deviceFlowProxyCache = new DeviceFlowProxyCache();

    public static DeviceFlowProxyCache getInstance() {

        if (deviceFlowProxyCache == null) {

            synchronized (DeviceFlowProxyCache.class) {

                if (deviceFlowProxyCache == null) {

                    /* instance will be created at request time */
                    deviceFlowProxyCache = new DeviceFlowProxyCache();
                }
            }
        }
        return deviceFlowProxyCache;
    }

    public static DeviceFlowProxyCache getDeviceFlowProxyCache() {

        return deviceFlowProxyCache;
    }

    public DeviceAuthReqCache getAuthRequestCache() {

        return deviceAuthReqCache;
    }

    public DeviceAuthResponseCache getDeviceAuthResponseCache() {

        return deviceAuthResponseCache;
    }

    public TokenResponseCache getTokenResponseCache() {

        return tokenResponseCache;
    }

}
