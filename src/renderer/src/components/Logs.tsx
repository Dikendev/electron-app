interface Log {
    level: string
    message: string
}

type Logs = Log[]

// interface LogsProps {
//     logs: Logs
// }

const Logs = ({ message, level }: Log): JSX.Element => {
    return (
        <>
            <div>
                message: {message}
                level: {level}
            </div>
        </>
    )
}

export default Logs
