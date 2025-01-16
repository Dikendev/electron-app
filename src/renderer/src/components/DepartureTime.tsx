interface DepartureTimeProps {
    expectedFinalWorkingHour: string
    dayTotalTime: string
    totalHoursAtLunch: string | null
}

const DepartureTime = ({ expectedFinalWorkingHour, dayTotalTime, totalHoursAtLunch }: DepartureTimeProps) => {

    if (!totalHoursAtLunch?.length) return (
        <p>
            O sistema precisa da do início e fim do almoço <br/> 
            para calcular a hora prevista da saída baseado na hora desejada.
        </p>
    )

    return (<>
        <div>
            Total intervalo almoço: {totalHoursAtLunch}
        </div>
        <div>
            Com carga horária de {dayTotalTime}
        </div>
        <div>
            Você tem que sair às: {expectedFinalWorkingHour}
        </div>
    </>)
}

export default DepartureTime