interface Times {
    startWorkingHourTime: string
    startLunchTime: string
    finishLunchTime: string
    expectedWorkingTimes: string
}

interface DepartureTimeResponse {
    totalLunch: string
    expectedFinalWorkingTime: string
}

export type {
    Times, 
    DepartureTimeResponse
}