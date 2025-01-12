interface WorkingTimes {
    workingTimesTotal: string
}

const WorkingTimes = ({ workingTimesTotal }: WorkingTimes) => {
    return (
        <>
            {workingTimesTotal.length === 0 ? (
                <></>
            ) : (
                (<p className="tip">
                    Total de horas mês: <span className="react">{workingTimesTotal}</span>
                </p>)
            )}
        </>
    )
}

export default WorkingTimes