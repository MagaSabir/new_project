import bcrypt from "bcrypt";

export interface IBcrypt {
    compare(password: string, hash: string): Promise<boolean>
}

class BcryptPasswordHash implements IBcrypt{
    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}

export const bcryptPasswordHash = new BcryptPasswordHash()