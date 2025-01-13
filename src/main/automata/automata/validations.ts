class ValidationManager {
    static isMonthValid(month: string) {
        const date = new Date()
        const actualMonth = date.toLocaleString('pt-BR', { month: 'long' })
        const first3Char = actualMonth.slice(0, 3)
        const lastTwoDigitsYear = date.getFullYear().toString().slice(-2)
        const formatDateString = `${first3Char}/${lastTwoDigitsYear}`
        return month.toUpperCase() == formatDateString.toUpperCase()
    }
}

export default ValidationManager
