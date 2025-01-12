import { ClientEmailCredentialMissingError, IdCredentialMissingError, PrivateKeyCredentialMissingError } from "../main/automata/errors/credential-error"
import { GoogleSheetCredentials } from "./automata"

type CredentialsValidationError =
    IdCredentialMissingError |
    ClientEmailCredentialMissingError |
    PrivateKeyCredentialMissingError

type CredentialValidation = CredentialsValidationError | GoogleSheetCredentials

export type {
    CredentialsValidationError,
    CredentialValidation
}