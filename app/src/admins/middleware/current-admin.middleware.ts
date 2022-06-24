import {Injectable, NestMiddleware} from "@nestjs/common";
import {Request, Response} from "express"
import {AdminsService} from "../services/admins.service";


@Injectable()
export class CurrentAdminMiddleware implements NestMiddleware {

    constructor(private adminsService: AdminsService) {}

    async use(req: Request, res: Response, next: (error?: any) => void): Promise<any> {
        const {adminId} = req.session || {};

        if (adminId) {
            req.currentAdmin = await this.adminsService.findById(adminId);
        }

        next();
    }
}