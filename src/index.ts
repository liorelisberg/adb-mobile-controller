import { DeviceHandler } from './handlers/device.handler';

// const client = Adb.createClient() as Client;

// const deviceManager = DeviceManager.getInstance(client);
// const deviceClientManager = new DeviceClientManager(client, deviceManager);

// const appManager = new AppManager();

// async function mainÍ() {

//   const deviceClient = await deviceClientManager.getDeviceClient();

//   if (!deviceClient) {
//     console.error("Failed to create DeviceClient.");
//     exit;
//   }

//   const bet365url = "www.bet365.com/#/HO/";
//   const packageName = "com.android.chrome";
//   const browserPath = `${packageName}/com.google.android.apps.chrome.Main`;


//   const appResponse = await appManager.openApp(deviceClient, { path: browserPath, url: bet365url });

//   if (appResponse?.includes("Error") || appResponse?.includes("Exception")) {
//     console.error(`Unable to open app: ${browserPath}`);
//     exit;
//   }

//   console.log("######### sleeping to close the app ###########")
//   await new Promise(resolve => setTimeout(resolve, 7000));

//   const closeResponse = await appManager.closeApp(deviceClient, packageName);
//   if (closeResponse?.includes("Error") || closeResponse?.includes("Exception")) {
//     console.error(`Unable to close app: ${packageName}`);
//     exit
//   }

//   console.log(`Closed ${browserPath}!\nCommand executed with output: ${appResponse}`);
// }

async function main() {
  const deviceHandler = new DeviceHandler();
  await deviceHandler.run();
}

main().catch(err => console.error('Error in main function:', err));



////////////////////////////////////////////


// import { Adb, DeviceClient } from '@devicefarmer/adbkit';
// import { AppManager } from './app.manager'; // Adjust the import path as necessary
// import { DeviceClientManager } from './device.client.manager'; // Adjust the import path as necessary
// import { DeviceManager } from './device.manager'; // Adjust the import path as necessary
// import readline from 'readline';

// class DeviceHandler {
//     private deviceManager: DeviceManager;
//     private deviceClientManager: DeviceClientManager;
//     private appManager: AppManager;

//     constructor() {
//         this.deviceManager = DeviceManager.getInstance();
//         this.deviceClientManager = DeviceClientManager.getInstance();
//         this.appManager = new AppManager();
//     }

//     async run() {
//         const device = await this.deviceManager.getDevice();

//         if (device) {
//             console.log(`Device ID: ${device.id}`);
//             console.log(`Device Type: ${device.type}`);

//             const deviceClient = await this.deviceClientManager.getDeviceClient(device.id);

//             await this.getUserInput(deviceClient);
//         } else {
//             console.log('No device found.');
//         }
//     }

//     async getUserInput(deviceClient: DeviceClient) {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });

//         let exitInput = false;

//         while (!exitInput) {
//             const input: string = await new Promise((resolve) => {
//                 rl.question('Enter the function to run (openApp, closeApp, exit): ', resolve);
//             });

//             switch (input.trim()) {
//                 case 'openApp':
//                     await this.handleOpenApp(deviceClient);
//                     break;
//                 case 'closeApp':
//                     await this.handleCloseApp(deviceClient);
//                     break;
//                 case 'exit':
//                     exitInput = true;
//                     console.log('Exiting...');
//                     break;
//                 default:
//                     console.log('Invalid input. Please enter "openApp", "closeApp", or "exit".');
//                     break;
//             }
//         }

//         rl.close();
//     }

//     async handleOpenApp(deviceClient: DeviceClient) {
//         const app = { path: 'com.android.chrome/com.google.android.apps.chrome.Main', url: 'www.example.com' }; // Example app details
//         const response = await this.appManager.openApp(deviceClient, app);
//         console.log('Open App Response:', response);
//     }

//     async handleCloseApp(deviceClient: DeviceClient) {
//         const packageName = 'com.android.chrome'; // Example package name
//         const response = await this.appManager.closeApp(deviceClient, packageName);
//         console.log('Close App Response:', response);
//     }
// }

// async function main() {
//     const deviceHandler = new DeviceHandler();
//     await deviceHandler.run();
// }

// main().catch(err => console.error('Error in main function:', err));

