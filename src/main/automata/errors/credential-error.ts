import { GoogleAuthExceptionMessages } from "google-auth-library/build/src/auth/googleauth"

class IdCredentialMissingError extends RangeError {
    constructor() {
        super()
        this.message = GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND
    }
}

class ClientEmailCredentialMissingError extends RangeError {
    constructor() {
        super()
        this.message = GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND
    }
}

class PrivateKeyCredentialMissingError extends RangeError {
    constructor() {
        super()
        this.message = GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND
    }
}

export {
    IdCredentialMissingError,
    ClientEmailCredentialMissingError,
    PrivateKeyCredentialMissingError,
}