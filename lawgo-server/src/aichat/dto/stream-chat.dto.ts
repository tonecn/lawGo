import { IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";

export class StreamChatDto {
    @IsString({ message: '内容必须是字符串' })
    @IsNotEmpty({ message: '内容不能为空' })
    @MinLength(1, { message: '内容至少包含1个字符' })
    @MaxLength(2000, { message: '内容不能超过2000个字符' })
    content: string;

    @IsString({ message: '不合法的索引' })
    @IsNotEmpty({ message: '索引不能为空' })
    @Length(36, 36, { message: '不合法的索引' })
    indexId: string;
}