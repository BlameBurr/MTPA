class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserError'
    }
}

class EvalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EvalError'
    }
}


module.exports.UserError = UserError;
module.exports.EvalError = EvalError;