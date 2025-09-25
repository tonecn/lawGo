import { reactive } from "vue";
import { AichatAPI } from "../api";

export type ChatCompletionRole = 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function';
export type ChatCompletionContent = {
    role: ChatCompletionRole,
    content: string;
};

export class VoiceChatVM {

    public data = reactive<{
        context: ChatCompletionContent[];
        llmLastOutput: string;
    }>({
        context: [],
        llmLastOutput: '',
    })

    constructor() {

    }

    async chat(content: string, options?: {
        onComplete: (content: string) => void;
    }) {
        // 组装请求参数
        this.data.context.push({
            role: 'user',
            content: content,
        })

        // 占位大模型响应
        const aiResponseChatItem = reactive({
            role: 'assistant',
            content: '',
        } as ChatCompletionContent);
        this.data.context.push(aiResponseChatItem);

        this.data.llmLastOutput = '';
        await AichatAPI.chatWithoutContext(
            this.data.context,
            {
                onData: (chunk) => {
                    aiResponseChatItem.content += chunk;
                    this.data.llmLastOutput += chunk;
                },
                onComplete: () => {
                    options?.onComplete?.(this.data.llmLastOutput);
                },
                onError: () => { },
            }
        ).catch(e => {
            throw new e;
        });
    }

    init() {
        this.data.context = [{
            role: 'system',
            content: '你是一个法律助手，请提供专业的法律建议。任何情况，都不得在输出中使用markdown语法，要求回答尽量简短且详细',
        }];
        this.data.llmLastOutput = '';
    }
}