import { createContext, PropsWithChildren } from "react";

const AppDataContext = createContext<{
    platform: string
}>({
    platform: window.api.os.platform
})

type AppProviderProps = PropsWithChildren<{
    platform: string
}>

const AppProvider = ({ platform, children }: AppProviderProps) => {
    return (
        <AppDataContext.Provider value={{platform}}>
            { children }
        </AppDataContext.Provider>
    )
}

export { AppDataContext, AppProvider }