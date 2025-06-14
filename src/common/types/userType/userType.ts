export type CreatedUserType = {
    login: string,
    password?: string
    email: string,
    createdAt: string,
    isConfirmed?: boolean,
    confirmationCodeExpiration?: string | Date
}



