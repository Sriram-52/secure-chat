/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private _service: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
    type: [User],
  })
  @Get('/getAll')
  getAll(): Promise<User[]> {
    return this._service.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User,
  })
  @Post('/create')
  create(@Body() body: CreateUserDto): Promise<User> {
    return this._service.createUser(body);
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User,
  })
  @Put(':id/update')
  update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this._service.updateUser(id, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Token retrieved successfully.',
    type: String,
  })
  @Get(':id/token')
  getToken(@Param('id') id: string): Promise<string> {
    return this._service.getToken(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Channel created successfully.',
    type: String,
  })
  @Post(':id/create-channel')
  createChannel(
    @Param('id') id: string,
    @Body() body: CreateChannelDto,
  ): Promise<string> {
    return this._service.createChannel(id, body.members);
  }
}
