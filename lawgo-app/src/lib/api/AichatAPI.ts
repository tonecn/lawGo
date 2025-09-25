import { request } from "../request"
import type { ChatHistory } from "../types/ChatHistory";
import type { ChatIndex } from "../types/ChatIndex";

export const chat = async (
    indexId: string,
    content: string,
    options: {
        onData?: (chunk: string) => void,
        onComplete?: () => void,
        onError?: (e: any) => void,
    }
) => streamRequest({
    path: 'aichat',
    data: {
        indexId,
        content,
    },
    onData: options.onData,
    onComplete: options.onComplete,
    onError: options.onError,
})

export const chatWithoutContext = async (
    messages: any[],
    options: {
        onData?: (chunk: string) => void,
        onComplete?: () => void,
        onError?: (e: any) => void,
    }
) => streamRequest({
    path: 'aichat/no-context',
    data: {
        messages: messages,
    },
    onData: options.onData,
    onComplete: options.onComplete,
    onError: options.onError,
})

const streamRequest = async (options: {
    path: 'aichat' | 'aichat/no-context',
    data: any;
    onData?: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (e: any) => void,
}) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${request.getUri()}/${options.path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(options.data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
            }

            const res = await response.json();
            throw new Error(`${res.message || '请求错误'}`)
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('请求异常');
        }

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                options?.onComplete?.();
                break;
            }

            const chunk = decoder.decode(value, { stream: true })
            options?.onData?.(chunk);
        }
    } catch (error) {
        options?.onError?.(error);
    }
}

export const initChat = async (): Promise<ChatIndex> =>
    request.post('aichat/init');

export const listChatIndexs = async (): Promise<ChatIndex[]> =>
    request.get('aichat/index');

export const getChatIndex = async (id: string): Promise<ChatIndex[]> =>
    request.get(`aichat/index/${id}`);

export const updateChatIndexTitle = async (id: string, title: string): Promise<boolean> =>
    request.put(`aichat/index/${id}`, { title })

export const deleteChatIndex = async (id: string): Promise<boolean> =>
    request.delete(`aichat/index/${id}`)

export const getChatHistory = async (indexId: string): Promise<ChatHistory[]> =>
    request.get(`aichat/history/${indexId}`)