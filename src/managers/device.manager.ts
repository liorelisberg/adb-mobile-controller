import { IDevice } from '../interfaces/device';
import { Client } from '../interfaces/client';

export class DeviceManager {
    private static instance: DeviceManager;
    private client: Client;

    private constructor(client: Client) {
        this.client = client;
    }

    static getInstance(client: Client): DeviceManager {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager(client);
        }
        return DeviceManager.instance;
    }

    async getDevice(): Promise<IDevice | null> {
        const devices = await this.client.listDevices();

        if (!devices || devices.length <= 0) {
            console.error('No devices were identified.');
            return null;
        }

        const firstDevice: IDevice = devices[0];

        return firstDevice;
    }
}
