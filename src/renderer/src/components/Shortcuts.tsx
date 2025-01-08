
interface ShortCutsProps {
  isOpen: boolean
}

const ShortCuts = ({ isOpen }: ShortCutsProps) => {
  const platform = window.api.os.platform

  if (!isOpen) return null

  return (
    <div className="shortCuts">
      <Command
        commandName="Início expediente"
        codeWin="shift + espaço + e"
        codeMac="command + e"
        platform={platform}
      />

      <Command commandName="Início almoço" codeWin="shift + espaço + a" codeMac="command + a" platform={platform} />

      <Command commandName="Fim almoço" codeWin="shift + espaço + b" codeMac="command + b" platform={platform} />

      <Command commandName="Fim expediente" codeWin="shift + espaço + f" codeMac="command + c" platform={platform} />
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