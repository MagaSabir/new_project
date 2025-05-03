import jwt from 'jsonwebtoken'
const JWT_SECRET = '12345'
export const jwtService = {
    async generateToken (userId: string, userLogin: string) {
        return jwt.sign({userId, userLogin}, JWT_SECRET, {expiresIn: '30m'})
},
    async verifyToken  (token: string) {
        return jwt.verify(token, JWT_SECRET) as {userId: string}
    }
}