import { StreamChatModule } from 'src/stream-chat/stream-chat.module';
import { UsersService } from './users.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [StreamChatModule],
  controllers: [],
  providers: [UsersService],
})
export class UsersModule {}
