import AppStatus from "src/types/app-status.interface"

import ia from '../assets/ia.svg'
import iOff from '../assets/ia-off.png'

interface LogoProps {
    credential: AppStatus
}

const Logo = ({ credential }: LogoProps) => {
    return (
        <img alt="logo" className="logo" src={credential.today ? ia : iOff} />
    )
}

export default Logo