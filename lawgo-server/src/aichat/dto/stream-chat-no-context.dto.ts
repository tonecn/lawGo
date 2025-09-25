import { ArrayMinSize, IsArray } from "class-validator";
import OpenAI from "openai";

export class StreamChatNoContextDto {
    @IsArray({ message: '请求参数错误' })
    @ArrayMinSize(1, { message: '请求参数错误' })
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
}