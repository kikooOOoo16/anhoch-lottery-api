import {Body, Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {UsersService} from "../services/users.service";
import {CurrentUser} from "../decorators/current-user.decorator";
import {UserDocument} from "../models/user";
import {AnyActiveSessionGuard} from "../../guards/any-active-session.guard";
import {UserActiveSessionGuard} from "../../guards/user-active-session.guard";
import {UpdateUserDTO} from "../dtos/update-user.dto";

@Controller('user')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Get()
    @UseGuards(UserActiveSessionGuard)
    async getUserData(@CurrentUser() user: UserDocument) {
        return user;
    }

    @Get('/:id')
    @UseGuards(AnyActiveSessionGuard)
    async getUserProfileData(@Param('id') userId: string) {
        return await this.usersService.findById(userId);
    }

    @Patch()
    @UseGuards(UserActiveSessionGuard)
    async updateUserData(@CurrentUser() user: UserDocument, @Body() updateUserDTO: UpdateUserDTO) {
        return await this.usersService.update(user, updateUserDTO);
    }

}
