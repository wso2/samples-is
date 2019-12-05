package validator;

import dao.DaoFactory;
import exceptions.BadRequest;
import exceptions.Expired;
import generator.CodeGenerator;
import parameters.DeviceFlowParameters;

import java.time.ZonedDateTime;
import java.util.Date;

public class Validator {

    private CodeGenerator codeGenerator = new CodeGenerator();
    private DeviceFlowParameters deviceFlowParameters = new DeviceFlowParameters();
    private DaoFactory daoFactory = new DaoFactory();
    private String AuthId = codeGenerator.getAuthReqId();
//    private Date date = new Date();
//    private Long time = date.getTime();

    public Validator() {

    }

    public boolean getClientId(String clientId) throws BadRequest {

        if (clientId.isEmpty()) {
            throw new BadRequest("client id is missing");
        }
        return clientId.equals("PdfQIjZEaS8unbadpqKplzx0fWEa");
    }

    public boolean getDeviceCode(String device_code) throws BadRequest, Expired {

        if (device_code.isEmpty()) {
            throw new BadRequest("device code is missing");
        } else if ((ZonedDateTime.now().toInstant().toEpochMilli() - daoFactory.getConnector("InMemoryCache")
                .getExpiresInCache(deviceFlowParameters.getClientId())) > deviceFlowParameters.getExpiresInDevice()) {
            System.out.println(ZonedDateTime.now().toInstant().toEpochMilli());
            System.out.println(daoFactory.getConnector("InMemoryCache")
                    .getExpiresInCache(deviceFlowParameters.getClientId()));
            throw new Expired("DeviceCodeExpired");
        }
        System.out.println(ZonedDateTime.now().toInstant().toEpochMilli());
        System.out.println(daoFactory.getConnector("InMemoryCache")
                .getExpiresInCache(deviceFlowParameters.getClientId()));
        return device_code.equals(daoFactory.getConnector("InMemoryCache").getDeviceCodeCache(deviceFlowParameters.getClientId()));
    }

    public boolean getGrantType(String grantType) throws BadRequest {

        if (grantType.isEmpty()) {
            throw new BadRequest("grant type is missing");
        }
        return grantType.equals("urn:ietf:params:oauth:grant-type:device_code");
    }

    public boolean getUserCode(String userCode) throws BadRequest {
        if (userCode.isEmpty()){
            throw new BadRequest("user code is wrong");
        }
        return userCode.equals(daoFactory.getConnector("InMemoryCache").getUserCodeCache(deviceFlowParameters.getClientId()));
    }

}
