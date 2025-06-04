// import { DepartureTimeResponse, Times } from '../../../types/automata/departure-time.interface'
// import DateUtils from '../utils/date-utils'

// const calculateDepartureTime = ({
//     startWorkingHours,
//     startLunch,
//     expectedWorkingTimes,
//     finishLunch
// }: Times): DepartureTimeResponse => {
//     console.log('-----------')

//     console.log('startWorkingHours', startWorkingHours)
//     console.log('startLunch', startLunch)
//     console.log('finishLunch', finishLunch)
//     console.log('expectedWorkingTimes', expectedWorkingTimes)

//     console.log('-----------')

//     const startAsSeconds = timeAsSeconds(startWorkingHours)
//     const startLunchAsSeconds = timeAsSeconds(startLunch)
//     const expectedWorkingTimeInSeconds = timeAsSeconds(expectedWorkingTimes)
//     const lunchSeconds = timeAsSeconds(finishLunch)

//     const totalLunch = startLunchAsSeconds - lunchSeconds
//     const sum = startAsSeconds + expectedWorkingTimeInSeconds + totalLunch

//     console.log(' expectedFinalWorkingTime: DateUtils.secondsToTime(sum)', DateUtils.secondsToTime(sum))

//     console.log(' Math.abs(totalLunch).toString()', Math.abs(totalLunch).toString())

//     return {
//         totalLunch: Math.abs(totalLunch).toString(),
//         expectedFinalWorkingTime: DateUtils.secondsToTime(sum)
//     }
// }

// const timeAsSeconds = (str: string): number => {
//     const [asStringHour, asStringMinutes] = str.split(':')
//     return DateUtils.timeToSeconds([asStringHour, asStringMinutes])
// }

// // const expectedTime = calculateDepartureTime({
// //     startWorkingHourTime: "08:30",
// //     startLunchTime: "12:35",
// //     finishLunchTime: "13:05",
// //     expectedWorkingTimes: "08:58"
// // })

// export { calculateDepartureTime }
