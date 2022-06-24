import {CanActivate, ExecutionContext} from "@nestjs/common";

export class AdminActiveSessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.session.adminId;
    }
}