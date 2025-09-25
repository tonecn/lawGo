import type { UserRole } from "./UserRole";

export type User = {
    id: string;
    username: string;
    phone: string;
    createdAt: string;
    updatedAt: null | string;// 原则上不为null，除非在新增阶段
    deletedAt: null | string;
    roles: UserRole[];
}