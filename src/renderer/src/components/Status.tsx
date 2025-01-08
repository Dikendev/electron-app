import Credentials from "./Credentials"

interface StatusProps {
  credentialStatus: boolean
}
const Status = ({ credentialStatus }: StatusProps) => {
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
      <Credentials id="fake1345" clientEmail="fake1345diego@sheets@gmail.com" privateKey="fake13452asadwff" />
    </div>
  )
}

export default Status