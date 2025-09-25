export type ChatHistory = {
    id: string;
    indexID: string;
    role: 'user' | 'assistant' | 'system';
    // isHidden: boolean;// to user
    content: string;
    createdAt: Date;
}