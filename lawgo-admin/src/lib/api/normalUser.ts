import { request } from "../request";
import type { User } from "../types/User";

export const me = async (): Promise<User> => request.get('/user/me');

export const updateProfile = async (data: {
    username?: string;
    password?: string;
}): Promise<boolean> => request.put('/user/profile', data);