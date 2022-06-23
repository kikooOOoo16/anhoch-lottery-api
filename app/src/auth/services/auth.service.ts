import { Injectable } from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {SignInUsedDTO} from "../../users/dtos/sign-in-used.dto";
import {UserDocument} from "../../users/models/user";
import {scrypt as _scrypt} from "crypto";
import {Buffer} from "buffer";
import {promisify} from "util";
import {WrongCredentialsException} from "../../exceptions/auth-related/wrong-credentials.exception";

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {}

    async signUp(createUserDTO) {
        return await this.usersService.create(createUserDTO);
    }

    async signIn({email, password}: SignInUsedDTO) {
        const user = await this.usersService.findByEmail(email);

        await AuthService.validatePassword(user, password);

        return user;
    }

    private static async validatePassword(user: UserDocument, password: string) {
        const [salt, storedHash] = user.password.split('.');

        const hash = await (scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new WrongCredentialsException();
        }
    }
}
