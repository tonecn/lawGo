import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModule as NormalUserModule } from 'src/user/user.module';

@Module({
  controllers: [UserController],
  imports: [NormalUserModule],
})
export class UserModule { }
