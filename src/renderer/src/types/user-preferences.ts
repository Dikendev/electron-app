export interface UserPreferences {
    configPath: string,
    defaultConfig: {
        windowBounds: {
            width: number, height: number
        }
    }
}