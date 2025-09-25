import { Module } from '@nestjs/common';
import { HuaweiService } from './huawei.service';
import { HuaweiController } from './huawei.controller';

@Module({
  providers: [HuaweiService],
  controllers: [HuaweiController]
})
export class HuaweiModule {}
