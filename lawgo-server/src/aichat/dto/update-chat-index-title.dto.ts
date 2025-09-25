import { IsString, Length } from "class-validator";

export class UpdateChatIndexTitleDto {
    @IsString()
    @Length(1, 20, { message: '不合法的参数' })
    title: string;
}