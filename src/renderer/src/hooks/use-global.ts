import { AppDataContext } from "@renderer/context/AppContext"
import { useContext } from "react"

const useGlobal = () => {
    const globalContext = useContext(AppDataContext)


    if (!globalContext) {
        throw new Error('Need to be a child of the global app')
    }

    return globalContext
}

export default useGlobal