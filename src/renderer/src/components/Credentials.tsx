import { useRef, useState } from 'react'
import gear from '../assets/gear.svg'

interface CredentialsProps {
    privateKey?: string
    clientEmail?: string
    id?: string
}

const Credentials = ({privateKey, clientEmail, id}: CredentialsProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openClose = () => {
        console.log('?')
        setIsOpen((prev) => !prev)
    }

    return (
        <div style={{display: 'flex', position: 'relative'}}>
            <img style={{ color: 'white', marginBottom: '0px' }} alt="config" className="shortcut_button" src={gear} onClick={openClose} />
            
            {isOpen ? (<>
                <div style={{position: 'absolute', bottom: '-5.5rem', left: '-10rem'}}>
                    <CredentialsModal privateKey={privateKey} clientEmail={clientEmail} id={id} />
                </div>
            </>) : null
            }
        </div>
    )
}

const CredentialsModal = ({privateKey, clientEmail, id}: CredentialsProps) => {
    return (
        <div>
            <CredentialKey description="id" key={id}/>
            <CredentialKey description="client email" key={clientEmail}/>
            <CredentialKey description="private key" key={privateKey}/>
        </div>
    )
}

interface CredentialKeyProps {
    description: string
    key?: string
}

const CredentialKey = ({description, key}: CredentialKeyProps) => {
    const isOpenBrowserFileDialog = useRef<boolean>(false)
    
    const handleFileSelected = (result) => {
        console.log('result.filePath.toString()', result.filePath.toString())
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

        console.log('isOpenBrowserFileDialog',isOpenBrowserFileDialog)

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

    return (
        <>
            {key ? (
                <div>
                    {description}: {key}
                </div>
            ) : (
                <div onClick={openDialog}>
                    + {description}
                </div>
            )}
        </>
    )
}

export default Credentials