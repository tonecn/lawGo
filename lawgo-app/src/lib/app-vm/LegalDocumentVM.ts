import { reactive } from "vue";
import { AichatAPI } from "../api";

export type ChatCompletionRole = 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function';
export type ChatCompletionContent = {
    role: ChatCompletionRole,
    content: string;
};

export type ContractChatContent = {
    id: string;
    createdAt: Date;
    isHidden?: boolean;
} & ChatCompletionContent;

export class LegalDocumentVM {

    public data = reactive<{
        documentType?: string;
        chatHistory: ContractChatContent[];
    }>({
        chatHistory: [],
    })

    constructor() { }

    setDocumentType(d: string) {
        this.data.documentType = d;
    }

    async initChat() {
        const documentType = this.data.documentType;
        if (!documentType) {
            throw new Error('初始化失败');
        }

        this.data.chatHistory = [
            {
                id: `${this.getId()}}`,
                role: 'system',
                content: `你是一个法律助手，请提供专业的法律建议。接下来要求你以对话引导询问的方式为用户创建一份${documentType}方面的法律文档，请你开始，直接告知用户你的行为以及向用户询问你所需要的内容即可，无需回答这句话。`,
                createdAt: new Date(),
                isHidden: true,
            },
        ];

        return this.chat();
    }

    async chat(userInput?: string) {
        if (userInput) {
            this.data.chatHistory.push({
                id: this.getId(),
                role: 'user',
                content: userInput,
                // 随机向前推1～2秒，确保用户和AI在时间上不一致
                createdAt: new Date(Date.now() - (1000 + Math.floor(Math.random() * 1000))),
            });
        }

        // 创建AI响应占位对象
        const aiResponse: ContractChatContent = reactive({
            id: this.getId(),
            role: 'assistant',
            content: '',
            createdAt: new Date(),
        })
        this.data.chatHistory.push(aiResponse);

        // 调用Chat接口
        await AichatAPI.chatWithoutContext(this.data.chatHistory, {
            onData: (chuck) => {
                aiResponse.content += chuck;
            },
            onComplete: () => { },
            onError: (e) => {
                throw e;
            }
        }).catch(e => {
            throw e;
        });
    }

    private getId() {
        return `${Date.now()}${Math.random()}`;
    }
}