import { Client as AdbClient } from "@devicefarmer/adbkit";
import { IDeviceClient } from "./device.client";


export class Client extends AdbClient {
    getDeviceClient(serial: string): IDeviceClient {
        return super.getDevice(serial);
    }
}