package cache;

import sources.Handlers;

import java.util.ArrayList;
import java.util.HashMap;

public class DeviceAuthResponseCache {

    private DeviceAuthResponseCache() {

    }

    private static DeviceAuthResponseCache deviceAuthResponseCache = new DeviceAuthResponseCache();

    static DeviceAuthResponseCache getInstance() {

        if (deviceAuthResponseCache == null) {

            synchronized (DeviceAuthReqCache.class) {

                if (deviceAuthResponseCache == null) {

                    /* instance will be created at request time */
                    deviceAuthResponseCache = new DeviceAuthResponseCache();
                }
            }
        }
        return deviceAuthResponseCache;
    }

    //    private ArrayList<Handlers> deviceAuthResCache = new ArrayList<Handlers>();
    private HashMap<String, String> DeviceCodeCache = new HashMap<String, String>();
    private HashMap<String, String> UserCodeCache = new HashMap<String, String>();
    private HashMap<String, String> VerificationURICache = new HashMap<String, String>();
    private HashMap<String, Long> ExpiresInCache = new HashMap<String, Long>();
    private HashMap<String, String> IntervalCache = new HashMap<String, String>();

    public void addDeviceCode(String DeviceCode, String ClientId) {

        DeviceCodeCache.put(DeviceCode, ClientId);
        System.out.println("DeviceCode Written to cache");

    }

    public String getDeviceCode(String AuthId) {

        System.out.println("DeviceCode Get from to cache");
        return DeviceCodeCache.get(AuthId);

    }

    public void addUserCode(String AuthId, String UserCode) {

        UserCodeCache.put(AuthId, UserCode);
        System.out.println("UserCode Written to cache");

    }

    public String getUserCode(String AuthId) {

        System.out.println("UserCode Get from to cache");
        return UserCodeCache.get(AuthId);

    }

    public void addVerificationURI(String AuthId, String VerificationURI) {

        VerificationURICache.put(AuthId, VerificationURI);
        System.out.println("VerificationURI Wrote to cache");

    }

    public void getVerificationURI(String AuthId, String VerificationURI) {

        VerificationURICache.get(AuthId);
        System.out.println("VerificationURI Get from to cache");

    }

    public void addExpiresIn(String AuthId, Long Time) {

        ExpiresInCache.put(AuthId, Time);
        System.out.println("ExpiresIn time declared");
        System.out.println(ExpiresInCache);

    }

    public Long getExpiresIn(String AuthId) {

        return ExpiresInCache.get(AuthId);
    }
}
