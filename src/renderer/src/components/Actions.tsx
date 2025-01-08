interface ActionsProps {
    credentialStatus: boolean
}

const Actions = ({ credentialStatus }: ActionsProps) => {
    return (
        <div className="actions">
            <div className="action">
                <a>
                    Início do expediente
                </a>
            </div>

            <div className="action">
                <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
                    Intervalo do almoço
                </a>
            </div>

            <div className={credentialStatus ? 'action' : 'action disabled'}>
                <a target="_blank" rel="noreferrer" onClick={() => { }}>
                    Fim do almoço
                </a>
            </div>

            <div className="action">
                <a target="_blank" rel="noreferrer" onClick={() => { }}>
                    Fim do expediente
                </a>
            </div>
        </div>
    )
}

export default Actions