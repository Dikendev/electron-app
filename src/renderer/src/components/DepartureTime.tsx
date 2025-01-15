interface DepartureTimeProps {
    time: string
    dayTotalTime: string
    totalHoursAtLunch: string | null
}

const DepartureTime = ({ time, dayTotalTime, totalHoursAtLunch }: DepartureTimeProps) => {

    if (!totalHoursAtLunch) return (
        <h1>
            O sistema precisa da hora da saída e fim do almoço <br/> 
            para calcular a hora da saída baseado na hora desejada de sair.
        </h1>
    )

    return (<>
        <div>
            Com carga horária de {dayTotalTime}
        </div>
        <div>
            Você tem que sair às: {time}
        </div>
    </>)
}

export default DepartureTime