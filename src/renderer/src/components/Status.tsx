
import { CredentialsInfo } from "../../../types/credentials-info.interface"
import Credentials from "./Credentials"

interface StatusProps {
    credentialStatus: boolean
    credentials: CredentialsInfo
    updateAll: UpdateAll
}

export interface UpdateAll {
    updateId: (id: string) => void
    updateClientEmail: (clientEmail: string) => void;
    updatePrivateKey: (privateKey: string) => void;
}

const Status = ({ credentialStatus, credentials, updateAll }: StatusProps) => {
    return (
        <div className="status">
            {credentialStatus ? (
                <>
                    <div className="green"></div>
                </>
            ) : (
                <>
                    <div className="red"></div>
                </>
            )}

            <div className="status_item"> credenciais</div>

            <div className="green"></div>
            <div className="status_item">internet</div>

            <Credentials
                id={credentials.id}
                clientEmail={credentials.clientEmail}
                privateKey={credentials.privateKey}
                updateAll={updateAll}
            />
        </div>
    )
}

export default Status