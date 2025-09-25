import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AichatModule } from './aichat/aichat.module';
import { HuaweiModule } from './huawei/huawei.module';
import { AdminModule } from './admin/admin.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 1000,
          ttl: 60000, // 1 minute
        },
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }), UserModule, AuthModule, AichatModule, HuaweiModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
