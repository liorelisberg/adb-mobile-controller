import { AppManager } from '../managers/app.manager';
import { DeviceClientManager } from '../managers/device.client.manager';
import { DeviceManager } from '../managers/device.manager';
import { Client } from '../interfaces/client';
import { IDeviceClient } from '../interfaces/device.client';
import Adb from '@devicefarmer/adbkit';
import readline from 'readline';
import { UserInputs, printUserInputOptions } from '../utils/user-inputs';

export class DeviceHandler {
    private deviceClientManager: DeviceClientManager;
    private appManager: AppManager;
    private deviceManager: DeviceManager;
    userOptions: string;
    client: Client;

    constructor() {
        this.client = Adb.createClient() as Client;

        this.deviceManager = DeviceManager.getInstance(this.client);
        this.deviceClientManager = DeviceClientManager.getInstance(this.client, this.deviceManager);
        this.appManager = AppManager.getInstance();

        this.userOptions = printUserInputOptions();
    }

    async run() {
        const deviceClient = await this.deviceClientManager.getDeviceClient();

        if (!deviceClient) {
            console.error("Failed to get a DeviceClient");
            return;
        }

        // deviceClient.root();

        await this.userInteract(deviceClient);
    }

    async userInteract(deviceClient: IDeviceClient) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let exitInput = false;

        while (!exitInput) {
            const input: string = await new Promise((resolve) => {
                rl.question(this.userOptions, resolve);
            });

            exitInput = await this.UserInputDispatcher(input, exitInput, deviceClient);
        }

        rl.close();
    }

    private async UserInputDispatcher(input: string, exitInput: boolean, deviceClient: IDeviceClient) {
        const userInput = parseInt(input, 10);

        if (isNaN(userInput) || !Object.values(UserInputs).includes(userInput)) {
            console.log("Invalid input. Please enter a valid number.");
            return exitInput;
        }

        switch (userInput) {
            case UserInputs.Exit:
                exitInput = true;
                console.log('Exiting...');
                break;

            case UserInputs.Reboot: {
                await this.appManager.rebootDevice(deviceClient);
                break;
            }


            case UserInputs.ChangeProxy:
                {
                    const response = await this.appManager.changeProxy(deviceClient);
                    console.log('Change proxy response:', response);
                    break;
                }

            case UserInputs.ResetProxy: {
                const response = await this.appManager.resetProxy(deviceClient);
                console.log('Reset proxy response:', response);
                break;
            }

            case UserInputs.LogProxySettings: {
                await this.appManager.logProxySettings(deviceClient);
                break;
            }

            case UserInputs.ChangeTimezone:
                await this.appManager.changeTimezone(deviceClient, "Europe/London");
                break;

            case UserInputs.LogTimezone:
                await this.appManager.logTimezone(deviceClient);
                break;

            case UserInputs.OpenApp:
                await this.openApp(deviceClient);
                break;

            case UserInputs.CloseApp:
                await this.closeApp(deviceClient);
                break;

            case UserInputs.TapComponent:
                await this.appManager.tap(deviceClient);
                break;

            case UserInputs.ScrollPage:
                await this.appManager.scroll(deviceClient);
                break;

            case UserInputs.GetElementPosition:
                const position = await this.appManager.getElementPosition(deviceClient);
                break;

            case UserInputs.LogDeviceProperties:
                await this.appManager.logDeviceProperties(deviceClient);
                break;

            case UserInputs.LogDeviceFeatures:
                await this.appManager.logDeviceFeatures(deviceClient);
                break;

            case UserInputs.LogDevicePackages:
                await this.appManager.logDevicePackages(deviceClient);
                break;

            default:
                console.log('Invalid input.');
                break;
        }
        return exitInput;
    }

    async openApp(deviceClient: IDeviceClient) {
        const app = { path: 'com.android.chrome/com.google.android.apps.chrome.Main', url: 'www.bet365.com/#/HO/' };
        const response = await this.appManager.openApp(deviceClient, app);
        console.log('Open App Response:', response);
    }

    async closeApp(deviceClient: IDeviceClient) {
        const packageName = 'com.android.chrome';
        const response = await this.appManager.closeApp(deviceClient, packageName);
        console.log('Close App Response:', response);
    }
}