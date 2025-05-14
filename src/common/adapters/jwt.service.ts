import jwt from 'jsonwebtoken'

export const jwtService = {
    async generateToken (userId: string, userLogin: string) {
        return jwt.sign({userId, userLogin}, process.env.JWT_SECRET!, {expiresIn: '30m'})
},
    async verifyToken  (token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!) as {userId: string, userLogin: string}
    }
}