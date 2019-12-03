<h2>is-query-profile-opensaml-v3</h2>
Assertion Query/Request Profile" defines a protocol for requesting dynamic or existing assertions by reference or by querying on the basis of a subject and additional statement-specific criteria.  According the specification, there are two entities 

<h3>Request and Response Messages<h3>
<h4>Common Scenario<h4>
<p>SAML Assertion query message types need to have a valid issuer, a signature and SAML version 2.0 set as the SAML authority to verify that the Service Provider who requests assertions is trusted and valid. The Issuer element needs to provide the fully qualified issuer value. If not, the authority may consider tenant domain as super. If the issuer is not valid, SAML authority returns an error message with error status. Signature of the request message is validated by a signature validator and returns the error status to the client if the signature is not valid. If the Issuer and the Signature is valid, the server starts processing the message based on message type of the request.</p>
<h4>SubjectQuery Message</h4>
<p>SubjectQuery message is the key request message of SAML Query Request profile. This message query the assertion by presenting Subject to the SAML authority and assemble Response messages. Each of the request messages need to satisfy pre-requisites to pass validation by presenting valid issuer, signature and SAML version. If the request is valid then authority checks the validity of the offered Subject. The SAML Authority may return Response with valid assertion to the requester with the signature. There are three request messages which are inherited from SubjectQuery message.</p>
<ul><li>AttributeQuery</li>
<li>AuthnQuery</li>
<li>AuthzDecisionQuery</li></ul>
<p>With the OpenSAML 3.2.0 library there is no any support to build a SubjectQuery request message. But the behavior of the AttributeQuery without any requested attributes is similar to the expected output of SubjectQuery.</p>

<h4>AttributeQuery</h4>
<p>AttributeQuery message is inherited message from SubjectQuery. This message returns requested attributes for existing subject. This message needs to satisfy pre-requisites to validate the request message. After validation, SAML authority inspects Subject element and validates subject to identify the NameID before collecting requested attributes. If the request message does not present <saml:Attribute> element, authority return all the attributes which are visible for requester.</p>
<h4>AuthnQuery</h4>
<p>AuthnQuery message is used to query assertions based on what assertions containing authentication statements are available for presented subject. This message needs to satisfy pre-requisites to validate message. Authentication statements can include either the SessionIndexattribute or <RequestedAuthnContext>element. Authority may return assertions which matches with the subject and one of the above authentication statements.</p>

<h4>AuthzDecisionQuery</h4>
<p>AuthzDecisionQuery is used to query assertions with the concept, that these actions on this resource can be allowed to this subject with given evidence. Request message need to have a valid issuer, signature, SAML version and subject. This message need to contain a resource URI which the subject needs to perform an action on. These actions are included within <saml:Action>element. It is optional to present <saml:Evidence>with a valid assertion-id or an assertion. SAML authority may return a response message with permission status to the requested resource for successful requests.</p>

<h4>AssertionIDRequest</h4>
<p>AssertionIDRequest message is used to request an assertion when requester knows the unique identifier of one or more assertions. This message is not an inherited message from SubjectQuery message. AssertionIDRequest needs to present valid issuer, signature and SAML version to consume assertions from SAML authority. Element <saml:AssertionIDRef> is used to indicate the unique identifier of requested assertion. If the request message does not contain assertion-id SAML authority return an error message.</p>
</br>
Java Doc Available :<a href="https://wso2-is-saml-request-profile.herokuapp.com" target="_blank">https://wso2-is-saml-request-profile.herokuapp.com</a>
