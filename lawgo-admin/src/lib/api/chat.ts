import { request } from "../request";
import type { ChatContent } from "../types/ChaContent";
import type { ChatIndex } from "../types/ChatIndex";
import type { User } from "../types/User";

export const listIndexs = async (): Promise<{
    indexs: ChatIndex[];
    users: User[];
}> => request.get('/admin/chat/index');

export const getIndex = async (id: string): Promise<{
    index: ChatIndex;
}> => request.get(`/admin/chat/index/${id}`);

export const updateIndex = async (id: string, title: string): Promise<boolean> =>
    request.put(`/admin/chat/index/${id}`, { title });

export const deleteIndex = async (id: string): Promise<boolean> =>
    request.delete(`/admin/chat/index/${id}`);

export const getChatHistory = async (id: string): Promise<{
    history: ChatContent[];
}> => request.get(`/admin/chat/history/${id}`);