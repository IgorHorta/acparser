class LineFormatError extends Error {
    constructor(message, range) {
        super(message)
        this.range = range;
        this.message = message;
        this.name = 'LineFormatError';
    }
}

module.exports = { LineFormatError };