export type ChatContent = {
    id: string;
    role: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function';
    content: string;
    createdAt: Date;
}