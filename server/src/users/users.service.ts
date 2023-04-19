/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { StreamChatService } from 'src/stream-chat/stream-chat.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private _streamChatService: StreamChatService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, publicKey } = createUserDto;
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await this._streamChatService.createUser({
      id: userRecord.uid,
      name,
      publicKey,
    });

    return {
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      publicKey: publicKey,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { name, publicKey } = updateUserDto;

    const userRecord = await admin.auth().getUser(id);
    if (name) {
      await admin.auth().updateUser(id, { displayName: name });
    }

    await this._streamChatService.updateUser(userRecord.uid, {
      name,
      publicKey,
    });

    return {
      id: userRecord.uid,
      email: userRecord.email,
      name: name || userRecord.displayName,
      publicKey: publicKey,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
  }

  async getToken(id: string) {
    return this._streamChatService.createToken(id);
  }

  async createChannel(id: string, members: string[]) {
    const channel = await this._streamChatService.createChannel(id, members);
    return channel.cid;
  }
}
