interface GoogleSheetCredentials {
    id: string
    clientEmail: string
    privateKey: string
}

interface GoogleSheetAuthCredentials extends GoogleSheetCredentials {
    scopes: string[]
}
export type {
    GoogleSheetCredentials, GoogleSheetAuthCredentials
}