import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { GoogleSheetAuthCredentials, GoogleSheetCredentials } from '../../../types/automata';
import { ClientEmailCredentialMissingError, IdCredentialMissingError, PrivateKeyCredentialMissingError } from '../errors/credential-error';

class GoogleSheetAuth {
    private credentials: GoogleSheetAuthCredentials = {
        id: '',
        clientEmail: '',
        privateKey: '',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    }

    constructor(credentials: GoogleSheetCredentials) {
        const { id, clientEmail, privateKey } = this.credentialsValidation(credentials)
        this.credentials.id = id
        this.credentials.clientEmail = clientEmail
        this.credentials.privateKey = privateKey
    }

    async loadSheet(): Promise<GoogleSpreadsheetWorksheet> {
        const serviceAccountAuth = new JWT({
            email: this.credentials.clientEmail,
            key: this.credentials.privateKey,
            scopes: this.credentials.scopes,
        });

        const doc = new GoogleSpreadsheet(this.credentials.id, serviceAccountAuth)
        await doc.loadInfo()
        return doc.sheetsByIndex[0]
    }

    private credentialsValidation(credentials: GoogleSheetCredentials): GoogleSheetCredentials {
        const { id, clientEmail, privateKey } = credentials

        if (id.length === 0) throw new IdCredentialMissingError()
        if (clientEmail.length === 0) throw new ClientEmailCredentialMissingError()
        if (privateKey.length === 0) throw new PrivateKeyCredentialMissingError()
        return credentials
    }
}

export default GoogleSheetAuth