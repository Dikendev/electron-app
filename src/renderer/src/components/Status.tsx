import AppStatus from "../../../types/app-status.interface"
import { UpdateAll } from "../../../types/automata/sheet-data.interface"
import { CredentialsInfo } from "../../../types/credentials-info.interface"
import Credentials from "./Credentials"

interface StatusProps {
    appStatus: AppStatus
    credentials: CredentialsInfo
    updateAll: UpdateAll
}

const Status = ({ appStatus, credentials, updateAll }: StatusProps) => {
    return (
        <div className="status">
            <InfoStatus
                appStatus={appStatus.credential}
                description="Credenciais"
            />

            <InfoStatus
                appStatus={appStatus.internet}
                description="Internet"
            />

            <Credentials
                id={credentials.id}
                clientEmail={credentials.clientEmail}
                privateKey={credentials.privateKey}
                updateAll={updateAll}
            />
        </div>
    )
}

interface InfoStatusProps {
    appStatus: boolean
    description: string
}

const InfoStatus = ({ appStatus, description }: InfoStatusProps) => {
    return (
        <>
            <div className={`${appStatus ? "green" : "red"}`}></div>
            <div className="status_item">{description}</div>
        </>
    )
}

export default Status