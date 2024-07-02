import { Client } from '../interfaces/client';
import { IDeviceClient } from '../interfaces/device.client';
import { DeviceManager } from './device.manager';

export class DeviceClientManager {
    private static instance: DeviceClientManager;
    private client: Client;
    private deviceManager: DeviceManager;

    private constructor(client: Client, deviceManager: DeviceManager) {
        this.client = client;
        this.deviceManager = deviceManager;
    }

    static getInstance(client: Client, deviceManager: DeviceManager): DeviceClientManager {
        if (!DeviceClientManager.instance) {
            DeviceClientManager.instance = new DeviceClientManager(client, deviceManager);
        }
        return DeviceClientManager.instance;
    }

    async getDeviceClient(): Promise<IDeviceClient | null> {
        const device = await this.deviceManager.getDevice();

        if (!device) {
            return null;
        }

        const deviceClient = this.client.getDevice(device.id);
        return deviceClient;
    }

    async getDeviceInfo() {
        const device =  await this.deviceManager.getDevice();

        console.log("############# device #############");
        console.log(`Id: ${device?.id}`);
        console.log(`Type: ${device?.type}`);
    }
}
