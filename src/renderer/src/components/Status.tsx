interface StatusProps {
    credentialStatus: boolean
}
const Status = ({ credentialStatus }: StatusProps) => {


    return (
        <div className="status">
            {credentialStatus ? (
                <>
                    <div className="green">
                    </div>

                    <div className="status_item">
                        credenciais
                    </div>
                </>
            ) : (
                <>
                    <div className="red">
                    </div>

                    <div className="status_item">
                        credenciais
                    </div>
                </>
            )}

            <div className="green">
            </div>

            <div className="status_item">
                internet
            </div>
        </div>
    )
}

export default Status