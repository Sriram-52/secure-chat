import { ConfigService } from '@nestjs/config';
import { StreamChatService } from './stream-chat.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [StreamChatService, ConfigService],
  exports: [StreamChatService],
})
export class StreamChatModule {}
