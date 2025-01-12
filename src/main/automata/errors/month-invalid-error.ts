class MonthInvalidError extends RangeError {
    constructor() {
        super()
        this.message = "Month not found or invalid, please verify the content of your spreed sheet"
    }
}

export { MonthInvalidError } 