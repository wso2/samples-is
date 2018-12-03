## Sample PIP Attribute Finder

* Before build

1. Change constants in the CustomPIPConstants.java with the category and the attributes involved.
2. Implement retrieveSampleName() method in CustomPIPAttributeFinder.java

```
private String retrieveSampleName(String accessToken) {

        String sampleName = null;

        // TODO: Get the value of the sample name from the sampleID from the datasource

        return sampleName;
}
```
* Build the the pack using 
`mvn clean install`

* Deploy in the jar in <IS_HOME>/repository/components/dropins.
* Add PIP Attribute Finder class in <IS_HOME>/repository/conf/identity/entitlement.properties
```
PIP.AttributeDesignators.Designator.1=org.wso2.carbon.identity.entitlement.pip.DefaultAttributeFinder
PIP.AttributeDesignators.Designator.2=org.wso2.carbon.identity.application.authz.xacml.pip.AuthenticationContextAttributePIP
+PIP.AttributeDesignators.Designator.3=org.wso2.sample.entitlement.pip.attribute.finder.CustomPIPAttributeFinder
``` 

* Restart the IS node.