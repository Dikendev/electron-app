import { useState } from 'react'

interface VersionsProps {
  idSheet?: string
}

function Versions({ idSheet }: VersionsProps): JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="help-link">
        <a href="https://github.com/Dikendev/electron-app/blob/main/README.md" target="_blank" rel="noreferrer">
          Como usar
        </a>
      </li>
      {idSheet && idSheet.length ? (
        <li className="help-link">
          <a href={`https://docs.google.com/spreadsheets/d/${idSheet}/`} target="_blank" rel="noreferrer">
            Abrir a planilha
          </a>
        </li>
      ) : (null)}
    </ul>
  )
}

export default Versions
