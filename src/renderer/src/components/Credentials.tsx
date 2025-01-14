import { useEffect, useState } from 'react'
import gear from '../assets/gear.svg'
import { CredentialsInfo } from '../../../types/credentials-info.interface'
import { UpdateAll } from '../../../types/automata/sheet-data.interface'

interface CredentialsProps extends CredentialsInfo {
    updateAll: UpdateAll
}

const Credentials = ({
    privateKey,
    clientEmail,
    id,
    updateAll
}: CredentialsProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openClose = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            <img
                style={{
                    color: 'white',
                    marginBottom: '0px'
                }}
                className="shortcut_button"
                src={gear}
                alt="config"
                onClick={openClose}
            />

            {isOpen ?
                (<div style={{ position: 'absolute', bottom: '-12rem', left: '-10rem' }}>
                    <CredentialsModal
                        id={id}
                        privateKey={privateKey}
                        clientEmail={clientEmail}
                        updateAll={updateAll}
                    />
                </div>
                ) : null
            }
        </div>
    )
}

type CredentialSendStatus = 'none' | 'idle' | 'success' | 'failure'

const CredentialsModal = ({ privateKey, clientEmail, id, updateAll }: CredentialsProps) => {
    const [credentialSendStatus, setCredentialSendStatus] = useState<CredentialSendStatus>('none')

    const saveCredentials = async () => {
        setCredentialSendStatus('idle')

        try {
            window.api.savePreference('credentials', {
                id: id,
                clientEmail: clientEmail,
                privateKey: privateKey
            })
            await updateAll.checkOnUpdate()
            setCredentialSendStatus('success')
        } catch (error) {
            setCredentialSendStatus('failure')
        }
    }

    useEffect(() => {
        const timeInMs = 2000
        if (credentialSendStatus === 'success') {
            setTimeout(() => {
                setCredentialSendStatus('none')
            }, timeInMs)
        }
    }, [credentialSendStatus])

    return (
        <div>
            <CredentialKey description="id" value={id} update={updateAll.updateId} />
            <CredentialKey description="client email" value={clientEmail} update={updateAll.updateClientEmail} />
            <CredentialKey description="private key" value={privateKey} update={updateAll.updatePrivateKey} />
            <button onClick={saveCredentials}>Salvar</button>
            <CredentialStatus credentialSendStatus={credentialSendStatus} />
        </div>
    )
}

interface CredentialStatusProps {
    credentialSendStatus: CredentialSendStatus
}

const CredentialStatus = (credentialSendStatus: CredentialStatusProps): JSX.Element => {
    switch (credentialSendStatus.credentialSendStatus) {
        case 'none': {
            return (<></>)
        }
        case 'idle': {
            return (<> Carregando</>)
        }
        case 'success': {
            return (<> Sucesso</>)
        }
        default: {
            return (<><p>Algo deu errado</p></>)
        }
    }
}

interface CredentialKeyProps {
    description: string
    value: string
    update: (key: string) => void
}

const CredentialKey = ({ description, value, update }: CredentialKeyProps) => {
    // const isOpenBrowserFileDialog = useRef<boolean>(false)

    // const handleFileSelected = (result) => {
    //     console.log('result.filePath.toString()', result.filePath.toString())
    // }

    const updateCredential = (event) => {
        console.log('value event', event)
        update(event.target.value)
    }

    // const openDialog = async () => {
    //     const homeDir = `${window.api.os.homeDir}/Desktop`
    //     const dialogConfig = {
    //         message: 'Aqui tem uma mensagem dinâmica',
    //         defaultPath: window.api.path.join(homeDir),
    //         title: `Selecionar um caminho para salvar o arquivo`,
    //         buttonLabel: 'Salvar',
    //         properties: ['openFile'],
    //         filters: [
    //             { name: 'Json', extensions: ['json'] },
    //         ]
    //     };

    //     console.log('isOpenBrowserFileDialog', isOpenBrowserFileDialog)

    //     if (isOpenBrowserFileDialog.current) {
    //         console.log('NAO PODE ABRIR')
    //     } else {
    //         console.log('else')
    //         isOpenBrowserFileDialog.current = true

    //         window.api.openDialog('showSaveDialog', dialogConfig).then(result => {
    //             console.log('result', result)
    //             isOpenBrowserFileDialog.current = false

    //             if (!result.canceled) {
    //                 handleFileSelected(result)

    //                 window.api.fs.writeFile(result.filePath.toString(), 'Sample', (error) => {
    //                     if (error) throw error
    //                     console.log('Saved!')
    //                 })
    //             }
    //         }).catch(error => {
    //             console.log(error)
    //         })
    //     }
    // }

    // useEffect(() => {
    //     const openFile = async () => {
    //         console.log('opening file through useEffect')
    //         const filePath = await window.api.openFile()
    //         console.log('filePath result works', filePath)
    //     }

    //     openFile()
    // }, [])

    return (
        <>
            <div>{description} </div>
            <input
                type="text"
                defaultValue={value}
                onChange={updateCredential}
            />
        </>
    )
}

export default Credentials