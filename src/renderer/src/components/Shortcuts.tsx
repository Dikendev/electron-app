import { useEffect, useState } from "react"

interface ShortCutsProps {
    isOpen: boolean
}

const ShortCuts = ({ isOpen }: ShortCutsProps) => {
    const [platForm, setPlatForm] = useState<string>(window.api.os.platform)

    useEffect(() => {
        if (platForm !== window.api.os.platform) {
            setPlatForm(window.api.os.platform)
        }
    }, [window.api.os.platform])

    if (!isOpen) return null

    return (
        <div className="shortCuts">
            <Command
                commandName="Início expediente"
                codeWin="shift + command + e"
                codeMac="c + e"
                platform={platForm} />

            <Command commandName="Início almoço" codeWin="shift + command + a" codeMac="c + a" platform={platForm} />

            <Command commandName="Fim almoço" codeWin="shift + command + b" codeMac="c + b" platform={platForm} />

            <Command commandName="Fim expediente" codeWin="shift + command + f" codeMac="c + c" platform={platForm} />
        </div>
    )
}

interface CommandProps {
    commandName: string
    codeWin: string
    codeMac: string
    platform: string
}
const Command = ({ commandName, codeWin, codeMac, platform }: CommandProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
            <p style={{ fontSize: '0.8rem' }}>{commandName}</p>

            {platform === 'win32' ? (
                <p style={{ fontSize: '0.8rem' }}><code>{codeWin}</code></p>
            ) : (
                <p style={{ fontSize: '0.8rem' }}><code>{codeMac}</code></p>
            )}
        </div>
    )
}

export default ShortCuts