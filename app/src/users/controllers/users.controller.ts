import {Controller, Get, Patch} from '@nestjs/common';
import {UsersService} from "../services/users.service";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Get()
    async getUserData() {}

    @Patch()
    async updateUserData() {}
}
