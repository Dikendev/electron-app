export class InvalidDateFormatError extends RangeError { }

class DateUtils {
    static formatDateWithDayAndMonth(): string {
        const toDay = new Date()
        const toDayDateWithLeadingMissingZeros = String(toDay.getDate()).padStart(2, '0')
        return `${toDayDateWithLeadingMissingZeros}/${toDay.getMonth() + String(toDay.getMonth() + 1)}`
    }

    static addHourToDate(date: Date, hour: number) {
        const asDate = new Date(date)
        asDate.setHours(asDate.getHours() - 3 + hour)
        return asDate
    }

    static formatHourAndMinutes(hourAndMinutes: string) {
        try {
            const hour = hourAndMinutes.split(':')
            let validHourAndMinutes: string

            const minLength = (time: string): boolean => time.length < 2
            minLength(hour[0])
                ? validHourAndMinutes = `${hour[0].padStart(2, '0')}`
                : validHourAndMinutes = hour[0]

            minLength(hour[1])
                ? validHourAndMinutes = `${validHourAndMinutes}:${hour[1].padStart(2, '0')}`
                : validHourAndMinutes = `${validHourAndMinutes}:${hour[1]}`

            return validHourAndMinutes
        } catch (error) {
            throw new InvalidDateFormatError('Invalid hour')
        }
    }

    static getActualHourAndTime() {
        const date = new Date()
        const hour = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hour}:${minutes}`
    }

    static stringTimeAsNumber(validHourAndMinutes: string): number {
        const splitHourAndMinutes = validHourAndMinutes.split(':')
        const hours = Number(splitHourAndMinutes[0])
        const minutes = Number(splitHourAndMinutes[1])
        return (hours + minutes / 60) / 24;
    }
}

export default DateUtils
