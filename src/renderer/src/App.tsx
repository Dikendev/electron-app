import { useEffect, useState } from 'react'
import ia from './assets/ia.svg'
import keyboard from './assets/keyboard.svg'
import Actions from './components/Actions'
import Clock from './components/Clock'
import ShortCuts from './components/Shortcuts'
import Status, { CredentialsInfo, UpdateAll } from './components/Status'
import Versions from './components/Versions'
import Loading, { LoadingStatus } from './components/Loading'

const App = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false)
    const [credentialStatus, setCredentialStatus] = useState<boolean>(true)

    const [credentials, setCredentials] = useState<CredentialsInfo>({
        id: '123',
        clientEmail: "diken.dev@gmai.com",
        privateKey: 'private'
    })

    useEffect(() => {
        const read = async () => {
            console.log("LOAIDNGGGGG", await window.api.loadPreferences())
        }

        const { } = read()
    }, [])

    const updateId = (id: string) => {
        window.api.savePreference('id', id)

        setCredentials((prev) => ({
            ...prev,
            id
        }))
    }

    const updateClientEmail = (clientEmail: string) => {
        window.api.savePreference('client_email', clientEmail)

        setCredentials((prev) => ({
            ...prev,
            clientEmail
        }))
    }

    const updatePrivateKey = (privateKey: string) => {
        window.api.savePreference('private_key', privateKey)

        setCredentials((prev) => ({
            ...prev,
            privateKey
        }))
    }

    const updateAll: UpdateAll = {
        updateId,
        updateClientEmail,
        updatePrivateKey
    }

    const [requestStatus, setRequestStatus] = useState<LoadingStatus>('idle')

    useEffect(() => {
        setTimeout(() => {
            console.log('?????????')
            window.api.receive("fromMain", (response) => {
                console.log("Received response from main process", response)
            })
        }, 5000)
        // quando iniciar a aplicação verificar o status.
        // sempre quando acontecer uma modificação na planilha atualizar os status das credenciais.
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            console.log(`You pressed ${event.key}`)
        }

        window.addEventListener('keyup', handleKeyPress)

        return () => {
            window.removeEventListener('keyup', handleKeyPress)
        }
    }, [])

    function openClose() {
        setIsOpen((prev) => !prev)
    }

    const simulateRequest = () => {
        setTimeout(() => {
            setRequestStatus('loading')
        }, 0)

        setTimeout(() => {
            setRequestStatus('success')
        }, 2000)
        setTimeout(() => {
            setRequestStatus('idle')
        }, 3000)
    }

    return (<>
        <div className="shortCuts_button">
            <img style={{ color: 'white' }} alt="logo" className="shortcut_button" src={keyboard} onClick={openClose} />
        </div>

        <ShortCuts isOpen={isOpen} />

        <img alt="logo" className="logo" src={ia} />

        <Status
            credentialStatus={credentialStatus}
            credentials={credentials}
            updateAll={updateAll}
        />

        <div className="creator">automatizando processos</div>
        <div className="creator">Powered by Consistem</div>
        <div className="text">
            Electron app with <span className="react">React</span>
            &nbsp;and <span className="ts">TypeScript</span>
        </div>

        <Clock />

        <p className="tip">
            {/* Please try pressing <code>F12</code> to open the devTool */}
            Aqui pode ter uma explicação do app
        </p>

        <Actions credentialStatus={credentialStatus} simulate={simulateRequest} />

        <div style={{ paddingTop: '3rem' }}>
            <Loading status={requestStatus} />
        </div>

        <Versions />
    </>)
}

export default App