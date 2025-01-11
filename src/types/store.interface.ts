interface DefaultConfig {
    windowBounds: WindowBounds
}

interface WindowBounds {
    width: number, height: number
}

interface IStore {
    configPath: string,
    defaultConfig: DefaultConfig
}

export type {
    DefaultConfig,
    WindowBounds,
    IStore
}