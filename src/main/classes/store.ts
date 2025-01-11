import fs from 'fs'
import path from 'path';
import { DefaultConfig, IStore } from '../../types/store.interface'

class Store {
    configPath: string = ""
    defaultConfig: DefaultConfig = {
        windowBounds: {
            width: 900, height: 670
        }
    }

    constructor(app: Electron.App) {
        this.configPath = path.join(app.getPath('userData'), 'config.json')
    }

    loadConfig<T>(): Promise<IStore | T> {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf-8')
                return JSON.parse(data)
            }
            return {
                configPath: this.configPath,
                defaultConfig: this.defaultConfig
            } as unknown as Promise<IStore | T>
        } catch (error) {
            console.error('Failed to load config', error)
            return {
                configPath: this.configPath,
                defaultConfig: this.defaultConfig
            } as unknown as Promise<IStore | T>
        }
    }

    saveConfig<T>(config: T) {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8')
        } catch (error) {
            console.error('Failed to save config', error)
        }
    }
}

export default Store