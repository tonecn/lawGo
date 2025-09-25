import { reactive } from "vue";
import { AichatAPI } from "../api";

type OcrResult = {
    direction: number;
    words_block_count: number;
    words_block_list: {
        confidence: number;// 0~1
        location: [number, number][]
        words: string;
    }[]
}

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

export class ContractVM {

    public data = reactive<{
        ocrResult?: OcrResult;
        contractScenario?: string;
        chatHistory: ContractChatContent[];
    }>({
        chatHistory: [],
    })

    constructor() { }

    setContractScnario(s: string) {
        this.data.contractScenario = s;
    }

    setOcrResult(r: OcrResult) {
        this.data.ocrResult = r;
    }

    async initChat() {
        const ocrResult = this.data.ocrResult;
        const contractScenario = this.data.contractScenario;
        if (!ocrResult || !contractScenario) {
            throw new Error('初始化失败');
        }

        this.data.chatHistory = [
            {
                id: `${this.getId()}}`,
                role: 'system',
                content: `你是一个法律助手，请提供专业的法律建议。接下来会发送给你一份经OCR处理的${contractScenario}，你需要详细分析其中可能存在的问题，并解答用户的疑问`,
                createdAt: new Date(),
                isHidden: true,
            },
            {
                id: `${this.getId()}`,
                role: 'system',
                content: `这是合同文档的内容，请你解析阅读并完成上面的要求：${JSON.stringify(ocrResult)}`,
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