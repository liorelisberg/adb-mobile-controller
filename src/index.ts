import { DeviceHandler } from './handlers/device.handler';

async function main() {
  const deviceHandler = new DeviceHandler();
  await deviceHandler.run();
}

main().catch(err => console.error('Error in main function:', err));