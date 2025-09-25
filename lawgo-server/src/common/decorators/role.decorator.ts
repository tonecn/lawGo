import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../enums/user-role.enum";

export const ROLES_KEY = 'roles';
export const Role = (roles: UserRole | UserRole[]) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return SetMetadata(ROLES_KEY, roleArray);
}