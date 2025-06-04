import { DepartureTimeResponse, Times } from "../../../types/automata/departure-time.interface"
import styles from '../styles/DepartureTime.module.css'
import { Descriptions } from 'antd'
import type { DescriptionsProps } from 'antd'

interface DepartureTimeProps {
    startWorkingHours: string | null
    startLunch: string | null
    finishLunch: string | null
    expectedWorkingTimes: string
}

const DepartureTime = ({
    startWorkingHours,
    startLunch,
    finishLunch,
    expectedWorkingTimes
}: DepartureTimeProps): JSX.Element => {
    if (!startWorkingHours || !startLunch || !finishLunch || !expectedWorkingTimes) {
        return (
            <p className={`tip ${styles.message}`}>
                É necessário informar o início e o fim do almoço para calcular a previsão de saída.
            </p>
        )
    }

    const result = calculateDepartureTime({
        startWorkingHours,
        startLunch,
        expectedWorkingTimes,
        finishLunch
    })

    const items: DescriptionsProps['items'] = [
        {
            key: 1,
            label: 'Tempo total de almoço',
            children: result.totalLunch,
        },
        {
            key: 2,
            label: 'Previsão de saída',
            children: result.expectedFinalWorkingTime,
        },
    ]

    return (
        <Descriptions style={{ borderRadius: '0.6rem' }} layout="vertical" bordered items={items} />
    )
}

const calculateDepartureTime = ({
    startWorkingHours,
    startLunch,
    expectedWorkingTimes,
    finishLunch
}: Times): DepartureTimeResponse => {
    const startAsSeconds = timeAsSeconds(startWorkingHours)
    const startLunchAsSeconds = timeAsSeconds(startLunch)
    const lunchSeconds = timeAsSeconds(finishLunch)
    const expectedWorkingTimeInSeconds = timeAsSeconds(expectedWorkingTimes)

    const totalLunch = lunchSeconds - startLunchAsSeconds
    const sum = (startAsSeconds + expectedWorkingTimeInSeconds) + totalLunch

    return {
        totalLunch: secondsToTime(totalLunch),
        expectedFinalWorkingTime: secondsToTime(sum)
    }
}

const timeToSeconds = ([hh, mm]: [string, string]): number => {
    return parseInt(hh, 10) * 3600 + parseInt(mm, 10) * 60
}

const secondsToTime = (totalSeconds: number, removeNegative?: boolean): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const removingHoursNegatives = removeNegative ? Math.abs(hours) : hours
    const removingSecondsNegatives = removeNegative ? Math.abs(minutes) : minutes
    return `${removingHoursNegatives.toString().padStart(2, '0')}:${removingSecondsNegatives.toString().padStart(2, '0')}`
}

const timeAsSeconds = (str: string): number => {
    const [asStringHour, asStringMinutes] = str.split(':')
    return timeToSeconds([asStringHour, asStringMinutes])
}

export default DepartureTime
