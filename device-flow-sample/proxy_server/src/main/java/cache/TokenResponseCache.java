package cache;

import java.util.HashMap;

public class TokenResponseCache {

    private TokenResponseCache() {

    }

    private static TokenResponseCache tokenResponseCache = new TokenResponseCache();

    static TokenResponseCache getInstance() {

        if (tokenResponseCache == null) {

            synchronized (TokenResponseCache.class) {

                if (tokenResponseCache == null) {

                    /* instance will be created at request time */
                    tokenResponseCache = new TokenResponseCache();
                }
            }
        }
        return tokenResponseCache;
    }

    private HashMap<String, String> TokenCache = new HashMap<String, String>();

    public void addToken(String deviceCode, String Token) {

        System.out.println("Token written to cache");
        TokenCache.put(deviceCode, Token);
        System.out.println(TokenCache);
    }

    public String getToken(String deviceCode) {

        System.out.println("Token get from cache");
        return TokenCache.get(deviceCode);
    }

}
