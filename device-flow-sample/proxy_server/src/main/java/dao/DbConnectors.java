package dao;

import sun.management.snmp.jvminstr.JvmMemPoolEntryImpl;

public interface DbConnectors {

    void addAuthRequest(String AuthId, String ClientId);

    void addDeviceCodeCache(String AuthId, String DeviceCode);

    void addUserCodeCache(String AuthId, String UserCode);

    void addVerificationURICache(String AuthId, String VerificationURI);

    void addExpiresInCache(String AuthId, Long ExpiresIn);

    void addInterval(String AuthId, String Interval);

    String getDeviceCodeCache(String AuthId);

    String getUserCodeCache(String AuthId);

    Long getExpiresInCache(String AuthId);

    void addTokenCache(String ClientId, String Token);

    String getTokenCache(String ClientId);
}
