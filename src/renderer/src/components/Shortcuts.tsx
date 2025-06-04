import { SheetCellContentFilledValueShortCut } from "../../../types/sheet-view-data.interface"

interface ShortCutsProps {
    shortCut: SheetCellContentFilledValueShortCut;
}
const SUPPORTED_PLATFORMS = ['win', 'darwin']

const ShortCuts = ({ shortCut }: ShortCutsProps) => {
    const platform = window.api.os.platform

    const available = SUPPORTED_PLATFORMS.includes(platform)

    if (!available) return null

    return (
        <div className="shortCuts">
            <Command
                codeWin={shortCut.win}
                codeMac={shortCut.mac}
                platform={platform}
            />
        </div>
    )
}

interface CommandProps {
    codeWin: string
    codeMac: string
    platform: string
}

const Command = ({ codeWin, codeMac, platform }: CommandProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
            {platform === 'win32' ? (
                <p style={{ fontSize: '0.8rem' }}><code>{codeWin}</code></p>
            ) : (
                <p style={{ fontSize: '0.8rem' }}><code>{codeMac}</code></p>
            )}
        </div>
    )
}

export default ShortCuts
