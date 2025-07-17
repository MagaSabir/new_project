export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}


export type CreatedUserType = {
    login: string,
    password?: string
    email: string,
    createdAt: Date,
    isConfirmed?: boolean,
    confirmationCodeExpiration?: string | Date
}
