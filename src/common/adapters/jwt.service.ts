import jwt, {JwtPayload} from 'jsonwebtoken'

export const jwtService = {
    async generateToken (userId: string, userLogin: string) {
        return jwt.sign({userId, userLogin}, process.env.JWT_SECRET!, {expiresIn: '10m'})
},
    async generateRefreshToken (userId: string,userLogin: string, deviceId: string) {
        return jwt.sign({userId, userLogin, deviceId}, process.env.JWT_SECRET!, {expiresIn: '20m'})
    },

    async verifyToken  (token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    }
}


