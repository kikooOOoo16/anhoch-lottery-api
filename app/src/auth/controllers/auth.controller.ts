import {Body, Controller, Post, Session, UseGuards, UseInterceptors} from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {NoActiveSessionGuard} from "../../guards/no-active-session.guard";
import {UserDocument} from "../../users/models/user";
import {SignInDTO} from "../dtos/sign-in.dto";
import {AnyActiveSessionGuard} from "../../guards/any-active-session.guard";
import {CreateUserDTO} from "../../users/dtos/create-user.dto";
import {UserDTO} from "../../users/dtos/user.dto";
import {SerializeDataInterceptor} from "../../interceptors/serialize-data.interceptor";
import {AdminDTO} from "../../admins/dtos/admin.dto";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    @UseGuards(NoActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(UserDTO))
    async signUpUser(@Body() createUserDTO: CreateUserDTO, @Session() session: any): Promise<UserDocument> {
        const user: UserDocument = await this.authService.signUp(createUserDTO);

        session.userId = user.id;

        return user;
    }

    @Post('/signin')
    @UseGuards(NoActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(UserDTO))
    async signInUser(@Body() signInDTO: SignInDTO, @Session() session: any) {
        const user = await this.authService.signIn(signInDTO);

        session.userId = user.id;

        return user;
    }

    @Post('/admin/signin')
    @UseGuards(NoActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
    async signInAdmin(@Body() signInDTO: SignInDTO, @Session() session: any) {
        const admin = await this.authService.signInAdmin(signInDTO);

        session.adminId = admin.id;

        return admin;
    }

    @Post('/signout')
    @UseGuards(AnyActiveSessionGuard)
    signOut(@Session() session: any) {
        session.userId = null;
        session.adminId = null;

        return {
            message: 'Signed out successfully.',
        }
    }
}
