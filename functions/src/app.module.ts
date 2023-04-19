import { StreamChatModule } from './stream-chat/stream-chat.module';
import { UserController } from './users/user.controller';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StreamChatModule, UsersModule, ConfigModule.forRoot()],
  controllers: [UserController, AppController],
  providers: [UsersService, AppService],
})
export class AppModule {}
