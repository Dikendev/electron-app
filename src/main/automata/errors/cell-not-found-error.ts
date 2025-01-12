class CellNotFoundError extends RangeError {
    constructor() {
        super()
        this.message = "Cell not found, please verify the content of your spreed sheet"
    }
}

export { CellNotFoundError }