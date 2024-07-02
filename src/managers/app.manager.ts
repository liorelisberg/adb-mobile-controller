import { IDeviceClient } from '../interfaces/device.client';
import { IApp } from '../interfaces/app';
import { Readable } from "stream";
import { DeviceManager } from './device.manager';
import { DeviceClientManager } from './device.client.manager';
import Adb from '@devicefarmer/adbkit';
import { Client } from '../interfaces/client';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export class AppManager {

    private static instance: AppManager;
    private deviceManager: DeviceManager;
    private deviceClientManager: DeviceClientManager;
    private setProxyCommands: string[];
    private resetProxyCommands: string[];
    getProxyCommands: string[];

    private constructor() {
        const client = Adb.createClient() as Client;
        this.deviceManager = DeviceManager.getInstance(client);
        this.deviceClientManager = DeviceClientManager.getInstance(client, this.deviceManager);

        const configPath = resolve(__dirname, 'proxy-config.json');
        var rawConfig: string;
        var config: any;

        try {
            rawConfig = readFileSync(configPath, 'utf-8');
        } catch (error) {
            console.error('Error reading proxy config file:', error);
            process.exit(1);
        }

        try {
            config = JSON.parse(rawConfig);
        } catch (error) {
            console.error('Error parsing proxy config file:', error);
            process.exit(1);
        }

        this.setProxyCommands = [
            `settings put global http_proxy ${config.proxy}:${config.port}`,
            `settings put global global_http_proxy_host ${config.proxy}`,
            `settings put global global_http_proxy_port ${config.port}`,
            `settings put global global_http_proxy_username ${config.authToken}`,
            `settings put global global_http_proxy_password ${config.password}`
        ];

        this.resetProxyCommands = [
            'settings put global http_proxy :0',
            'settings put global https_proxy :0'
        ];

        this.getProxyCommands = [
            "settings get global http_proxy",
            "settings get global global_http_proxy_host",
            "settings get global global_http_proxy_port",
            "settings get global global_http_proxy_username",
            "settings get global global_http_proxy_password",
        ];
    }

    static getInstance(): AppManager {
        if (!AppManager.instance) {
            AppManager.instance = new AppManager();
        }
        return AppManager.instance;
    }

    rebootDevice(deviceClient: IDeviceClient) {
        deviceClient.reboot();
    }

    async openApp(deviceClient: IDeviceClient | null, app: IApp): Promise<string | null> {
        if (!deviceClient) {
            return null;
        }

        const shellResponse = await this.runShellCommand(deviceClient, "adb shell");
        if (shellResponse.includes("error")) {
            return shellResponse;
        }

        const appResponse = await this.runShellCommand(deviceClient, `am start -n ${app.path} -d ${app.url}`);
        return appResponse;
    }

    async closeApp(deviceClient: IDeviceClient | null, packageName: string): Promise<string | null> {
        if (!deviceClient) {
            return null;
        }

        const shellResponse = await this.runShellCommand(deviceClient, "adb shell");
        if (shellResponse.includes("error")) {
            return shellResponse;
        }

        const appResponse = await this.runShellCommand(deviceClient, `am force-stop ${packageName}`);

        return appResponse;
    }

    async changeProxy(deviceClient: IDeviceClient): Promise<string | null> {
        if (!deviceClient) {
            return null;
        }

        var shellResponse = "";

        this.setProxyCommands.forEach(async command => {
            var respone = await this.runShellCommand(deviceClient, command);
            shellResponse += respone + '\n';

            if (respone.includes("error") || respone.includes("not found")) {
                return shellResponse;
            }
        });

        return shellResponse;
    }

    async resetProxy(deviceClient: IDeviceClient) {
        if (!deviceClient) {
            return null;
        }

        var shellResponse = "";

        this.resetProxyCommands.forEach(async command => {
            var respone = await this.runShellCommand(deviceClient, command);
            shellResponse += respone + '\n';

            if (respone.includes("error") || respone.includes("not found")) {
                return shellResponse;
            }
        });

        return shellResponse;
    }

    async logProxySettings(deviceClient: IDeviceClient): Promise<void> {
        try {
            console.log('Current Proxy Settings:');
            for (const command of this.getProxyCommands) {
                const result = await this.runShellCommand(deviceClient, command);
                console.log(`${command}: ${result}`);
            }
        } catch (error) {
            console.error('Error logging proxy settings:', error);
        }
    }

    async changeTimezone(deviceClient: IDeviceClient, timezone: string): Promise<void> {
        try {
            const command = `settings put global time_zone ${timezone}`;
            await this.runShellCommand(deviceClient, command);
        } catch (error) {
            console.error('Error changing timezone:', error);
        }
    }

    async logTimezone(deviceClient: IDeviceClient): Promise<void> {
        try {
            const command = 'settings get global time_zone';
            const timezone = await this.runShellCommand(deviceClient, command);
            console.log(`\nCurrent Timezone: ${timezone}`);
        } catch (error) {
            console.error('Error logging timezone:', error);
        }
    }

    async tap(deviceClient: IDeviceClient) {
        throw new Error('Method not implemented.');
    }

    async scroll(deviceClient: IDeviceClient) {
        throw new Error('Method not implemented.');
    }

    async getElementPosition(deviceClient: IDeviceClient) {
        throw new Error('Method not implemented.');
    }

    private async runShellCommand(deviceClient: IDeviceClient, command: string): Promise<string> {
        try {
            const output = await deviceClient.shell(command);
            const result = await this.streamToString(output);
            return result;
        } catch (error: any) {
            throw new Error(`Failed to run shell command: ${command}. Error: ${error.message}`);
        }
    }

    private async streamToString(stream: Readable): Promise<string> {
        const chunks: Buffer[] = [];
        for await (let chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString('utf-8');
    }

    async logDeviceFeatures(deviceClient: IDeviceClient) {
        await this.deviceClientManager.getDeviceInfo();

        console.log("############# features #############");
        const features = await deviceClient.getFeatures();
        for (const key in features) {
            console.log(`${key}: ${features[key]}`);
        }
        console.log("##################################\n\n");
    }

    async logDeviceProperties(deviceClient: IDeviceClient) {
        await this.deviceClientManager.getDeviceInfo();

        console.log("############# properties #############");
        const props = await deviceClient.getProperties();
        for (const key in props) {
            console.log(`${key}: ${props[key]}`);
        }
        console.log("##################################\n\n");
    }

    async logDevicePackages(deviceClient: IDeviceClient) {
        await this.deviceClientManager.getDeviceInfo();

        console.log("############# packages #############");
        const packages = await deviceClient.getPackages();
        for (const key in packages) {
            console.log(`${key}: ${packages[key]}`);
        }
        console.log("##################################\n\n");
    }
}
