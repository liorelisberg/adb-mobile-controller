export enum UserInputs {
    Exit,
    Reboot,
    ChangeProxy,
    ResetProxy,
    LogProxySettings,
    ChangeTimezone,
    LogTimezone,
    OpenApp,
    CloseApp,
    TapComponent,
    ScrollPage,
    GetElementPosition,
    LogDeviceProperties,
    LogDeviceFeatures,
    LogDevicePackages,
}

export function printUserInputOptions(): string {
    var output = "#################################\nAvailable User Inputs:";
    for (const [key, value] of Object.entries(UserInputs)) {
        if (!isNaN(Number(key))) continue; // Skip numeric keys
        output += `\n${key}: ${value}`;
    }

    output += '\nInput:  ';
    return output;
}