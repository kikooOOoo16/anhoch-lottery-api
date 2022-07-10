import { CanActivate, ExecutionContext } from '@nestjs/common';

export class NoActiveSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return !request.session.userId && !request.session.adminId;
  }
}
