package jdbc;

public class DeviceFlowProxyJDBC {

    private DeviceFlowProxyJDBC(){

    }

    private static DeviceFlowProxyJDBC deviceFlowProxyJDBC = new DeviceFlowProxyJDBC();

    public static DeviceFlowProxyJDBC getInstance() {

        if (deviceFlowProxyJDBC == null) {

            synchronized (DeviceFlowProxyJDBC.class) {

                if (deviceFlowProxyJDBC == null) {

                    /* instance will be created at request time */
                    deviceFlowProxyJDBC = new DeviceFlowProxyJDBC();
                }
            }
        }
        return deviceFlowProxyJDBC;
    }

    public static DeviceFlowProxyJDBC getDeviceFlowJDBC(){
        return deviceFlowProxyJDBC;
    }

}
