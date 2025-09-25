import { Module } from '@nestjs/common';
import { AichatController } from './aichat.controller';
import { AichatService } from './aichat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiChatHistory } from './entities/aichat-history.entity';
import { AichatIndex } from './entities/aichat-index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    AiChatHistory,
    AichatIndex,
  ])],
  controllers: [AichatController],
  providers: [AichatService],
  exports: [AichatService],
})
export class AichatModule { }
