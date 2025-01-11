import { useEffect, useState } from 'react'
import ia from './assets/ia.svg'
import keyboard from './assets/keyboard.svg'
import Actions from './components/Actions'
import Clock from './components/Clock'
import ShortCuts from './components/Shortcuts'
import Versions from './components/Versions'
import Loading, { LoadingStatus } from './components/Loading'
import Status, { UpdateAll } from './components/Status'
import { UserPreferences } from '../../types/user-preferences'
import { IStore } from '../../types/store.interface'
import { CredentialsInfo } from '../../types/credentials-info.interface'

const App = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false)
    const [credentialStatus, setCredentialStatus] = useState<boolean>(true)

    const [credentials, setCredentials] = useState<CredentialsInfo>({
        id: '123',
        clientEmail: "diken.dev@gmai.com",
        privateKey: 'private'
    })

    useEffect(() => {
        const read = async (): Promise<UserPreferences | IStore> => {
            return await window.api.loadPreferences<UserPreferences>()
        }

        read().then((result) => {
            if ('credentials' in result) {
                setCredentials((prev) => ({
                    ...prev,
                    ...result.credentials
                }))
            }
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    const updateId = (id: string) => {
        setCredentials((prev) => ({
            ...prev,
            id
        }))
    }

    const updateClientEmail = (clientEmail: string) => {
        setCredentials((prev) => ({
            ...prev,
            clientEmail
        }))
    }

    const updatePrivateKey = (privateKey: string) => {
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