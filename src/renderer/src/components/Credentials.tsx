import { useRef, useState } from 'react'
import gear from '../assets/gear.svg'
import { UpdateAll } from './Status'
import { CredentialInfo } from '../types/credential-info.interface'

interface CredentialsProps extends CredentialInfo {
    updateAll: UpdateAll
}

const Credentials = ({
    privateKey,
    clientEmail,
    id,
    updateAll
}: CredentialsProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openClose = () => {
        console.log('?')
        setIsOpen((prev) => !prev)
    }

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            <img style={{ color: 'white', marginBottom: '0px' }} alt="config" className="shortcut_button" src={gear} onClick={openClose} />

            {isOpen ? (<>
                <div style={{ position: 'absolute', bottom: '-10.5rem', left: '-10rem' }}>
                    <CredentialsModal privateKey={privateKey} clientEmail={clientEmail} id={id} updateAll={updateAll} />
                </div>
            </>) : null
            }
        </div>
    )
}

const CredentialsModal = ({ privateKey, clientEmail, id, updateAll }: CredentialsProps) => {
    return (
        <div>
            <CredentialKey description="id" value={id} update={updateAll.updateId} />
            <CredentialKey description="client email" value={clientEmail} update={updateAll.updateClientEmail} />
            <CredentialKey description="private key" value={privateKey} update={updateAll.updatePrivateKey} />
        </div>
    )
}

interface CredentialKeyProps {
    description: string
    value: string
    update: (key: string) => void
}

const CredentialKey = ({ description, value, update }: CredentialKeyProps) => {
    const isOpenBrowserFileDialog = useRef<boolean>(false)

    const handleFileSelected = (result) => {
        console.log('result.filePath.toString()', result.filePath.toString())
    }

    const updateCredential = (event) => {
        console.log('value event', event)
        update(event.target.value)
    }

    const openDialog = async () => {
        const homeDir = `${window.api.os.homeDir}/Desktop`
        const dialogConfig = {
            message: 'Aqui tem uma mensagem dinâmica',
            defaultPath: window.api.path.join(homeDir),
            title: `Selecionar um caminho para salvar o arquivo`,
            buttonLabel: 'Salvar',
            properties: ['openFile'],
            filters: [
                { name: 'Json', extensions: ['json'] },
            ]
        };

        console.log('isOpenBrowserFileDialog', isOpenBrowserFileDialog)

        if (isOpenBrowserFileDialog.current) {
            console.log('NAO PODE ABRIR')
        } else {
            console.log('else')
            isOpenBrowserFileDialog.current = true

            window.api.openDialog('showSaveDialog', dialogConfig).then(result => {
                console.log('result', result)
                isOpenBrowserFileDialog.current = false

                if (!result.canceled) {
                    handleFileSelected(result)

                    window.api.fs.writeFile(result.filePath.toString(), 'Sample', (error) => {
                        if (error) throw error
                        console.log('Saved!')
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }

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