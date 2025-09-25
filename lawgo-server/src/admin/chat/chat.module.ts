import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AichatModule } from 'src/aichat/aichat.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ChatController],
  imports: [AichatModule, UserModule],
})
export class ChatModule { }
