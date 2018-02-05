import java.io.File;
import org.w3c.dom.Document;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException; 

public class AppId {
    public static void main(String[] args) {

        try {
            DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
            Document doc = docBuilder.parse (new File("response_unformatted.xml"));

            NodeList appId  = doc.getElementsByTagName("ax2140:applicationID");

            Element appElement = (Element)appId.item(0);
            NodeList appList = appElement.getChildNodes();
            System.out.println(((Node)appList.item(0)).getNodeValue().trim());

        }catch (SAXParseException err) {
        System.out.println ("** Parsing error" + ", line "
             + err.getLineNumber () + ", uri " + err.getSystemId ());
        System.out.println(" " + err.getMessage ());
	System.exit(-1);

        }catch (SAXException e) {
        Exception x = e.getException ();
        ((x == null) ? e : x).printStackTrace ();
	System.exit(-1);

        }catch (Throwable t) {
        t.printStackTrace ();
	System.exit(-1);
        }
    
	System.exit(0);
    }
}

