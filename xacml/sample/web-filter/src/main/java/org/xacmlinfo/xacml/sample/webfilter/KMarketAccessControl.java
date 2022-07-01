/*
*  Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
*  WSO2 Inc. licenses this file to you under the Apache License,
*  Version 2.0 (the "License"); you may not use this file except
*  in compliance with the License.
*  You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

package org.xacmlinfo.xacml.sample.webfilter;

import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.util.AXIOMUtil;
import org.xacmlinfo.xacml.pep.agent.PEPAgent;
import org.xacmlinfo.xacml.pep.agent.PEPAgentException;
import org.xacmlinfo.xacml.pep.agent.dto.DecisionDTO;
import org.xacmlinfo.xacml.pep.agent.dto.EntitledDataDTO;

import javax.xml.namespace.QName;
import java.io.Console;
import java.util.*;

/**
 * On-line trading sample
 */
public class KMarketAccessControl {

    private static String products = "[1] Food ($20.00)\t[2] Drink ($5.00)\t[3] Fruit ($15.00)\t[4] " +
            "Liquor ($80.00)\t [5] Medicine ($50.00)\n";

    public static void main(String[] args){

        // create agent instances
        PEPAgent agent = null;
        try {
            agent = PEPAgent.getInstance(Utils.buildPEPConfig(Utils.loadConfigProperties()));
            DecisionDTO decisionDTO  = agent.getAllEntitlementsOfUser("", "asela", null);
            EntitledDataDTO entitledDataDTO = decisionDTO.getEntitledDataDTO();
            System.out.println("============ Resource ============");
            for(String resource : entitledDataDTO.getResources()){
                System.out.println(resource);
            }
            System.out.println("============ Action ============");
            for(String action : entitledDataDTO.getActions()){
                System.out.println(action);
            }
        } catch (PEPAgentException e) {
            System.err.println("\nError while initializing PEP agent\n");
            System.exit(0);
        }
        
        
       
        
        
        
        Console console;
        String userName = null;
        String password = null;
        String productName = null;
        int numberOfProducts = 1;
        int totalAmount;

        // print description
        printDescription();
        



        System.out.println("\nPlease login to K-market trading system\n");

        if ((console = System.console()) != null){
            userName = console.readLine("Enter User name : ");
            if(userName == null || userName.trim().length() < 1 ){
                System.err.println("\nUser name can not be empty\n");
                System.exit(0);
            }

            char[] passwordData;
            if((passwordData = console.readPassword("%s", "Enter User Password :")) != null){
                password = String.valueOf(passwordData);
            } else {
                System.err.println("\nPassword can not be empty\n");
                System.exit(0);
            }

            // TODO here we are not worry about authentication. This also can be done through WSO2IS APIs
            //if(agent.authenticate(userName, password)){
                System.out.println("\nUser is authenticated Successfully\n");
            //} else {
            //    System.err.println("\nUser is NOT authenticated\n");
            //    System.exit(0);
            //}
        }

        System.out.println("\nYou can select one of following items for your shopping chart : \n");

        System.out.println(products);    

        if ((console = System.console()) != null){

            String productId = console.readLine("Enter Product Id : ");
            if(productId == null || productId.trim().length() < 1 ){
                System.err.println("\nProduct Id can not be empty\n");
                System.exit(0);
            } else {
               // productName = idMap.get(productId);
                if(productName == null){
                    System.err.println("\nEnter valid product Id\n");
                    System.exit(0);
                }
            }

            String productAmount = console.readLine("Enter No of Products : ");
            if(productAmount == null || productAmount.trim().length() < 1 ){
                numberOfProducts = 1;
            } else {
                numberOfProducts = Integer.parseInt(productAmount);
            }
        }

        totalAmount = 100;//calculateTotal(productName, numberOfProducts);
        System.out.println("\nTotal Amount is  : " + totalAmount + "\n");

        System.out.println("\nStarting Transaction ..........\n");

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String request = Utils.createRequest(userName, productName, numberOfProducts, totalAmount);

        System.out.println("\n======================== XACML Request ====================");
        System.out.println(request);
        System.out.println("===========================================================");

        String response = null;
        try {
            response = agent.getDecision(request);
        } catch (PEPAgentException e) {
            e.printStackTrace();
            System.err.println("\nError while evaluating authorization\n");
            System.exit(0);
        }

        System.out.println("\n======================== XACML Response ===================");
        System.out.println(response);
        System.out.println("===========================================================");

        if(response != null){
            OMElement advice = null;
            String simpleDecision = null;
            String reason = null;
            try{
                OMElement decisionElement = AXIOMUtil.stringToOM(response);
                if(decisionElement != null){
                    OMElement result = decisionElement.getFirstChildWithName(new QName("Result"));
                    if(result != null){
                        simpleDecision = result.getFirstChildWithName(new QName("Decision")).getText();
                        advice = result.getFirstChildWithName(new QName("AssociatedAdvice"));
                    }
                }

                if("Permit".equals(simpleDecision)){
                    System.out.println("\nTransaction was completed successfully\n");
                    System.exit(0);
                }

                if("Deny".equals(simpleDecision)){
                    if(advice != null){
                        Iterator iterator =  advice.getChildElements();
                        // only takes 1st advice and attribute assignment.
                        if(iterator.hasNext()){
                            OMElement element = (OMElement) iterator.next();
                            Iterator attributeIterator = element.getChildElements();
                            if(attributeIterator.hasNext()){
                                OMElement attribute = (OMElement) attributeIterator.next();
                                reason = attribute.getText();
                            }

                        }
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }
            System.err.println("\nYou are NOT authorized to perform this transaction\n");
            if(reason != null){
                System.err.println("Due to " + reason + "\n");     
            }
        } else {
            System.err.println("\nInvalid authorization response\n");
        }
        System.exit(0);
    }

    public static void printDescription(){

        System.out.println("\nK-Market is on-line trading company. They have implemented some access " +
                "control over the on-line trading using XACML policies. K-Market has separated their " +
                "customers in to three groups and has put limit on on-line buying items.\n");

    }
}
