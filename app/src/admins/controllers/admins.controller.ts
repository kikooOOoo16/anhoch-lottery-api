import {Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {NoActiveSessionGuard} from "../../guards/no-active-session.guard";
import {AdminsService} from "../services/admins.service";
import {CreateAdminDTO} from "../dtos/create-admin.dto";
import {SerializeDataInterceptor} from "../../interceptors/serialize-data.interceptor";
import {AdminDTO} from "../dtos/admin.dto";
import {AdminActiveSessionGuard} from "../../guards/admin-active-session.guard";
import {CurrentAdmin} from "../decorators/current-admin.decorator";
import {UpdateAdminDTO} from "../dtos/update-admin.dto";
import {AdminDocument} from "../models/admin.model";

@Controller('admins')
export class AdminsController {

    constructor(private adminsService: AdminsService) {}

    @Post('/create')
    @UseGuards(NoActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
    async createAdminAccount(@Body() createAdminDTO: CreateAdminDTO) {
        return await this.adminsService.create(createAdminDTO);
    }

    @Patch('/update')
    @UseGuards(AdminActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
    async updateAdmin(@Body() updateAdminDTO: UpdateAdminDTO, @CurrentAdmin() admin: AdminDocument) {
        return await this.adminsService.update(admin, updateAdminDTO);
    }

    @Get()
    @UseGuards(AdminActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
    getCurrentAdminData(@CurrentAdmin() admin: AdminDocument) {
        return admin;
    }
}
