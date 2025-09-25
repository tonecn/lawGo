import { request } from "../request";
import type { User } from "../types/User";
import type { UserRole } from "../types/UserRole";

export const list = async (): Promise<User[]> => request.get('/admin/user');

export const get = async (id: string): Promise<User> => request.get(`/admin/user/${id}`);

export const create = async (data: {
    phone: string;
    username?: string;
    password?: string;
    roles?: UserRole[];
}): Promise<User> => {
    const body: {
        phone: string;
        username?: string;
        password?: string;
        roles?: UserRole[];
    } = {
        phone: data.phone,
    };

    if (data.username) {
        body.username = data.username;
    }

    if (data.password) {
        body.password = data.password;
    }

    if (data.roles) {
        body.roles = data.roles;
    }

    return request.post('/admin/user', body)
}

export const update = async (id: string, data: {
    phone?: string;
    username?: string;
    password?: string;
    roles?: UserRole[];
}): Promise<User> => {
    const body: {
        phone?: string;
        username?: string;
        password?: string;
        roles?: UserRole[];
    } = {};

    if (data.phone) {
        body.phone = data.phone;
    }

    if (data.username) {
        body.username = data.username;
    }

    if (data.password) {
        body.password = data.password;
    }

    if (data.roles) {
        body.roles = data.roles;
    }

    return request.put(`/admin/user/${id}`, body);
}

export const remove = async (id: string) => request.delete(`/admin/user/${id}`)