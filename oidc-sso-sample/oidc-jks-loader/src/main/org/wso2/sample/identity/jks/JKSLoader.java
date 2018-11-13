package org.wso2.sample.identity.jks;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class JKSLoader implements ServletContextListener {

    private static final Logger LOGGER = Logger.getLogger(JKSLoader.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        // First find jks properties
        final InputStream jksResource = this.getClass().getClassLoader().getResourceAsStream("jks.properties");

        if (jksResource == null) {
            LOGGER.log(Level.SEVERE, "jks.properties is not defined. keystore will not be set");
            return;
        }

        // Load properties
        final Properties jksProperties = new Properties();

        try {
            jksProperties.load(jksResource);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error while loading properties", e);
            return;
        }

        // Find and set JKS required for IS server communication
        final URL resource = this.getClass().getClassLoader().getResource(jksProperties.getProperty("keystorename"));

        if (resource != null) {
            LOGGER.log(Level.INFO, "Setting trust store path to : " + resource.getPath());
            System.setProperty("javax.net.ssl.trustStore", resource.getPath());
            System.setProperty("javax.net.ssl.trustStorePassword", jksProperties.getProperty("keystorepassword"));
        } else {
            LOGGER.log(Level.INFO, "Unable to find JKS");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        // Ignored
    }
}
