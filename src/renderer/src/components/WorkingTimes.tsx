interface WorkingTimes {
    workingTimesTotal: string
}

const WorkingTimes = ({ workingTimesTotal }: WorkingTimes) => {
    return (
        <p>
            {workingTimesTotal.length === 0 ? (
                <>Carregando</>
            ) : (<>Total de horas mês: {workingTimesTotal} </>)
            }
        </p>
    )
}

export default WorkingTimes