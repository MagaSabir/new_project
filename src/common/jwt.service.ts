import jwt from 'jsonwebtoken'
const JWT_SECRET = '12345'
export const jwtService = {
    async generateToken (userId: string) {
        return jwt.sign({userId}, JWT_SECRET, {expiresIn: '10m'})
},
    async verifyToken  (token: string) {
        return jwt.verify(token, JWT_SECRET) as {userId: string}
    }
}