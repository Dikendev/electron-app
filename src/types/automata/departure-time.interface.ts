interface Times {
    startWorkingHours: string
    startLunch: string
    finishLunch: string
    expectedWorkingTimes: string
}

interface DepartureTimeResponse {
    totalLunch: string
    expectedFinalWorkingTime: string
}

export type { Times, DepartureTimeResponse }
