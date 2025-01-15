import DateUtils from "../utils/date-utils"

interface Times {
    startWorkingHourTime: string
    startLunchTime: string
    finishLunchTime: string
    expectedWorkingTimes: string
}

const calculateDepartureTime = ({ 
    startWorkingHourTime, 
    startLunchTime, 
    expectedWorkingTimes, 
    finishLunchTime 
}: Times) => {
    const startAsSeconds = timeAsSeconds(startWorkingHourTime)
    const startLunchAsSeconds = timeAsSeconds(startLunchTime)
    const lunchSeconds = timeAsSeconds(finishLunchTime)
    const expectedWorkingTimeInSeconds = timeAsSeconds(expectedWorkingTimes)

    const totalLunch = startLunchAsSeconds - lunchSeconds
    const sum = (startAsSeconds + expectedWorkingTimeInSeconds) + (totalLunch)
    return DateUtils.secondsToTime(sum)
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