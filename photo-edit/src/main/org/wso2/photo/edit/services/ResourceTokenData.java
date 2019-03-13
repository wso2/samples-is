package org.wso2.photo.edit.services;

public class ResourceTokenData {

    private String resourceId;
    private String token;

    public ResourceTokenData(String resourceId, String token) {
        this.resourceId = resourceId;
        this.token = token;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "ResourceTokenData{" +
               "resourceId='" + resourceId + '\'' +
               ", token='" + token + '\'' +
               '}';
    }
}
