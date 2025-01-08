import { useEffect, useState } from 'react'
import electronLogo from './assets/electron.svg'
import Actions from './components/Actions'
import Clock from './components/Clock'
import ShortCuts from './components/Shortcuts'
import Status from './components/Status'
import Versions from './components/Versions'

const App = (): JSX.Element => {
    const [credentialStatus, setCredentialStatus] = useState<boolean>(true)

    useEffect(() => {
        // quando iniciar a aplicação verificar o status.
        // sempre quando acontecer uma modificação na planilha atualizar os status das credenciais.
    }, [])

    return (<>
        <ShortCuts />

        <img alt="logo" className="logo" src={electronLogo} />

        <Status credentialStatus={credentialStatus} />

        <div className="creator">COOP APP ELECTRON</div>
        <div className="creator">Powered by Consistem</div>
        <div className="text">
            Build an Electron app with <span className="react">React</span>
            &nbsp;and <span className="ts">TypeScript</span>
        </div>

        <Clock />
        <p className="tip">
            {/* Please try pressing <code>F12</code> to open the devTool */}
            Aqui pode ter uma explicação do app
        </p>

        <Actions credentialStatus={credentialStatus} />
        <Versions />
    </>)
}

export default App