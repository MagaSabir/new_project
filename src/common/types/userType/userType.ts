export type CreatedUserType = {
    login: string,
    email: string,
    createdAt: string,
    isConfirmed?: boolean,
    confirmationCodeExpiration?: string | Date
}



