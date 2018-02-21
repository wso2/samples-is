/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import java.io.File;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import java.util.logging.Logger;
import java.io.IOException;

public class AppId {

    private static Logger LOGGER = Logger.getLogger("AppId");

    public static void main(String[] args) {

        try {
            DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(new File("response_unformatted.xml"));

            NodeList appId = doc.getElementsByTagName("ax2140:applicationID");

            Element appElement = (Element) appId.item(0);
            NodeList appList = appElement.getChildNodes();
            System.out.println(((Node) appList.item(0)).getNodeValue().trim());

        } catch (SAXParseException err) {
            LOGGER.info("** Parsing error" + ", line "
                    + err.getLineNumber() + ", uri " + err.getSystemId());
            System.exit(-1);

        } catch (SAXException e) {
            Exception x = e.getException();
            ((x == null) ? e : x).printStackTrace();
            System.exit(-1);

        } catch (ParserConfigurationException er) {
            LOGGER.info("** Parser configuration error" + er.getMessage ());
            System.exit(-1);

        } catch (IOException error) {
            LOGGER.info("** Error occured" + error.getMessage ());
            System.exit(-1);
        }

        System.exit(0);
    }
}
