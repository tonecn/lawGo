import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Observable } from "rxjs";
import { UserRole } from "../enums/user-role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException('用户登录凭证获取失败');
        }

        const hasRole = requiredRoles.some((role) => user.hasRole?.(role));
        if (!hasRole) {
            throw new ForbiddenException('无权限');
        }

        return true;
    }
}