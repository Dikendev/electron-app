import { useState } from 'react'

function Versions(): JSX.Element {
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
    </ul>
  )
}

export default Versions
