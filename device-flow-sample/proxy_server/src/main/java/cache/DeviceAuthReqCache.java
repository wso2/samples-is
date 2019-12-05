package cache;

import sources.Handlers;

import java.util.ArrayList;
import java.util.HashMap;

public class DeviceAuthReqCache {

    private DeviceAuthReqCache() {

    }

    private static DeviceAuthReqCache deviceAuthReqCache = new DeviceAuthReqCache();

    public static DeviceAuthReqCache getInstance() {

        if (deviceAuthReqCache == null) {

            synchronized (DeviceAuthReqCache.class) {

                if (deviceAuthReqCache == null) {

                    /* instance will be created at request time */
                    deviceAuthReqCache = new DeviceAuthReqCache();
                }
            }
        }
        return deviceAuthReqCache;

    }

    //private ArrayList<Handlers> deviceAuthRequestCache = new ArrayList<Handlers>();
    private HashMap<String, String> AuthReqCache = new HashMap<String, String>();

    public void add(String AuthId, String ClientId) {

        AuthReqCache.put(AuthId, ClientId);
        System.out.println("Written to AuthReqCache");
    }

    public void remove(String AuthId, String ClientId) {

        AuthReqCache.remove(AuthId, ClientId);
    }

    public void get(String AuthId) {

    }

}
