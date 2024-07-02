import { Duplex } from "stream";
import {
  DeviceClient as IAdbDeviceClient,
  Features,
  Properties,
  WithToString,
} from "@devicefarmer/adbkit";
import Bluebird from "bluebird";

export interface IDeviceClient extends IAdbDeviceClient {
  shell(command: string | ArrayLike<WithToString>): Bluebird<Duplex>;
  getFeatures(): Bluebird<Features>;
  getProperties(): Bluebird<Properties>;
  getPackages(): Bluebird<string[]>;
}
