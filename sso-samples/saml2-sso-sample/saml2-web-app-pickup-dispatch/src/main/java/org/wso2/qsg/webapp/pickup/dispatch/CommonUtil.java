package org.wso2.qsg.webapp.pickup.dispatch;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.opensaml.xml.XMLObject;
import org.opensaml.xml.io.Marshaller;
import org.opensaml.xml.io.MarshallerFactory;

import org.opensaml.xml.util.Base64;
import org.w3c.dom.Element;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSOutput;
import org.w3c.dom.ls.LSSerializer;
import org.wso2.carbon.identity.sso.agent.bean.LoggedInSessionBean;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class CommonUtil {

    private static Log log = LogFactory.getLog(CommonUtil.class);


    /**
     * Serialize the Auth. Request
     *
     * @param xmlObject
     * @return serialized auth. req
     */
    public static String marshall(XMLObject xmlObject) throws Exception {

        ByteArrayOutputStream byteArrayOutputStream = null;
        try {

            MarshallerFactory marshallerFactory = org.opensaml.xml.Configuration.getMarshallerFactory();
            Marshaller marshaller = marshallerFactory.getMarshaller(xmlObject);
            Element element = marshaller.marshall(xmlObject);

            byteArrayOutputStream = new ByteArrayOutputStream();
            DOMImplementationRegistry registry = DOMImplementationRegistry.newInstance();
            DOMImplementationLS impl = (DOMImplementationLS) registry.getDOMImplementation("LS");
            LSSerializer writer = impl.createLSSerializer();
            LSOutput output = impl.createLSOutput();
            output.setByteStream(byteArrayOutputStream);
            writer.write(element, output);
            return byteArrayOutputStream.toString("UTF-8");
        } catch (Exception e) {
            log.error("Error Serializing the SAML Response");
            throw new Exception("Error Serializing the SAML Response", e);
        } finally {
            if (byteArrayOutputStream != null) {
                try {
                    byteArrayOutputStream.close();
                } catch (IOException e) {
                    log.error("Error while closing the stream", e);
                }
            }
        }
    }

    public static Map<String, String> getClaimValueMap(final LoggedInSessionBean loggedInSessionBean) {

        final Map<String, String> samlClaimValuePairs = new HashMap<>();

        final Map<String, String> subjectAttributes = loggedInSessionBean.getSAML2SSO().getSubjectAttributes();

        for (String localClaimKey : subjectAttributes.keySet()) {
            String claimValue = subjectAttributes.get(localClaimKey);
            // Extract the last string literal from local claim key
            String[] splits = localClaimKey.split("/");
            samlClaimValuePairs.put(splits[splits.length - 1], claimValue);
        }

        return samlClaimValuePairs;
    }

    /**
     * Encoding the response
     *
     * @param xmlString String to be encoded
     * @return encoded String
     */
    public static String encode(String xmlString) {
        // Encoding the message
        String encodedRequestMessage =
                Base64.encodeBytes(xmlString.getBytes(StandardCharsets.UTF_8),
                        Base64.DONT_BREAK_LINES);
        return encodedRequestMessage.trim();
    }

}

