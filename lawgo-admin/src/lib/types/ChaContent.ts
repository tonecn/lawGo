export type ChatContent = {
    id: string;
    indexID: string;
    role: 'user' | 'assistant' | 'system';
    isHidden: boolean;// to user
    content: string;
    createdAt: string;
}