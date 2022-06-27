import {Body, Controller, Get, Param, Patch, UseGuards, UseInterceptors} from '@nestjs/common';
import {UsersService} from "../services/users.service";
import {CurrentUser} from "../decorators/current-user.decorator";
import {UserDocument} from "../models/user.model";
import {AnyActiveSessionGuard} from "../../guards/any-active-session.guard";
import {UserActiveSessionGuard} from "../../guards/user-active-session.guard";
import {UpdateUserDTO} from "../dtos/update-user.dto";
import {UserDTO} from "../dtos/user.dto";
import {SerializeDataInterceptor} from "../../interceptors/serialize-data.interceptor";

@Controller('user')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Get()
    @UseGuards(UserActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(UserDTO))
    async getUserData(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        return user;
    }

    @Get('/:id')
    @UseGuards(AnyActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(UserDTO))
    async getUserProfileData(@Param('id') userId: string): Promise<UserDocument> {
        return await this.usersService.findById(userId);
    }

    @Patch()
    @UseGuards(UserActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(UserDTO))
    async updateUserData(@CurrentUser() user: UserDocument, @Body() updateUserDTO: UpdateUserDTO): Promise<UserDocument> {
        return await this.usersService.update(user, updateUserDTO);
    }
}
