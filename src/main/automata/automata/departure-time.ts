import { DepartureTimeResponse, Times } from "../../../types/automata/departure-time.interface"
import DateUtils from "../utils/date-utils"

const calculateDepartureTime = ({ 
    startWorkingHourTime, 
    startLunchTime, 
    expectedWorkingTimes, 
    finishLunchTime 
}: Times): DepartureTimeResponse => {
    const startAsSeconds = timeAsSeconds(startWorkingHourTime)
    const startLunchAsSeconds = timeAsSeconds(startLunchTime)
    const expectedWorkingTimeInSeconds = timeAsSeconds(expectedWorkingTimes)
    const lunchSeconds = timeAsSeconds(finishLunchTime)

    const totalLunch = startLunchAsSeconds - lunchSeconds
    const sum = (startAsSeconds + expectedWorkingTimeInSeconds) + (totalLunch)

    return {
        totalLunch: Math.abs(totalLunch).toString(),
        expectedFinalWorkingTime: DateUtils.secondsToTime(sum)
    }
}

const timeAsSeconds = (str: string) => {
    const [asStringHour, asStringMinutes] = str.split(':')
    return DateUtils.timeToSeconds([asStringHour, asStringMinutes])
}

// const expectedTime = calculateDepartureTime({
//     startWorkingHourTime: "08:30",
//     startLunchTime: "12:35",
//     finishLunchTime: "13:05",
//     expectedWorkingTimes: "08:58"
// })


export { calculateDepartureTime }