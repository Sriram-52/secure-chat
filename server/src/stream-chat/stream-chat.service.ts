/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as admin from 'firebase-admin';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamChatService {
  client: StreamChat;

  constructor(private _configService: ConfigService) {
    this.client = StreamChat.getInstance(
      _configService.get<string>('STREAM_API_KEY'),
      _configService.get<string>('STREAM_API_SECRET'),
    );
  }

  async createUser({
    id,
    name,
    publicKey,
  }: {
    id: string;
    name: string;
    publicKey: string;
  }) {
    return this.client.upsertUser({
      id,
      name,
      publicKey,
    });
  }

  async updateUser(id: string, user: UpdateUserDto) {
    return this.client.partialUpdateUser({
      id: id,
      set: {
        ...JSON.parse(JSON.stringify(user)),
      },
    });
  }

  async createToken(userId: string) {
    return this.client.createToken(userId);
  }

  async createChannel(userId: string, members: string[]) {
    const ref = admin.firestore().collection('channels').doc();
    const channel = this.client.channel('messaging', ref.id, {
      members: [...members, userId],
      created_by: { id: userId },
    });
    await channel.create();
    return channel;
  }
}
