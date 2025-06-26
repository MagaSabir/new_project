import jwt, {JwtPayload} from 'jsonwebtoken'

export interface ITokenService  {
    generateAccessToken(userId: string, userLogin: string): Promise<string>,
    generateRefreshToken(userId: string, userLogin: string, deviceId: string): Promise<string>,
    verifyToken(token: string): Promise<any>
}

export const jwtService = {
    async generateAccessToken(userId: string, userLogin: string) {
        return jwt.sign({userId, userLogin}, process.env.JWT_SECRET!, {expiresIn: '1h'})
    },

    async generateRefreshToken(userId: string, userLogin: string, deviceId: string) {
        return jwt.sign({userId, userLogin, deviceId}, process.env.JWT_SECRET!, {expiresIn: '1h'})
    },

    async verifyToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    }
}


