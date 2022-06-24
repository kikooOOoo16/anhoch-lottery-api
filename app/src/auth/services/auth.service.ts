import { Injectable } from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {SignInDTO} from "../dtos/sign-in.dto";
import {UserDocument} from "../../users/models/user";
import {scrypt as _scrypt} from "crypto";
import {Buffer} from "buffer";
import {promisify} from "util";
import {WrongCredentialsException} from "../../exceptions/auth-related/wrong-credentials.exception";
import {AdminsService} from "../../admins/services/admins.service";
import {AdminDocument} from "../../admins/models/admin";

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private adminsService: AdminsService) {}

    async signUp(createUserDTO) {
        return await this.usersService.create(createUserDTO);
    }

    async signIn({email, password}: SignInDTO) {
        const user = await this.usersService.findByEmail(email);

        await AuthService.validatePassword(user, password);

        return user;
    }

    async signInAdmin({email, password}: SignInDTO) {
        const admin = await this.adminsService.findByEmail(email);

        await AuthService.validatePassword(admin, password);

        return admin;
    }

    private static async validatePassword(account: UserDocument | AdminDocument, password: string) {
        const [salt, storedHash] = account.password.split('.');

        const hash = await (scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new WrongCredentialsException();
        }
    }
}
