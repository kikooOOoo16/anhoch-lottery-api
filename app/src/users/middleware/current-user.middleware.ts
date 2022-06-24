import {Injectable, NestMiddleware} from "@nestjs/common";
import {UserDocument} from "../models/user";
import {UsersService} from "../services/users.service";
import {Request, Response} from "express"
import {AdminDocument} from "../../admins/models/admin";

declare global {
    namespace Express {
        interface Request {
            currentAdmin?: AdminDocument;
            currentUser?: UserDocument;
            session: any;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: (error?: any) => void): Promise<any> {
        const {userId} = req.session || {};

        if (userId) {
            req.currentUser = await this.usersService.findById(userId);
        }

        next();
    }
}