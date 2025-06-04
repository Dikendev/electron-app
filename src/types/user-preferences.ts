import { CredentialsInfo } from "./credentials-info.interface"

interface UserPreferences {
    configPath: string,
    defaultConfig: {
        windowBounds: {
            width: number, height: number
        }
    },
    windowBounds: {
        width: number, height: number
    },
    workingTime: { value: string },
    credentials: CredentialsInfo
}

export type {
    UserPreferences
}