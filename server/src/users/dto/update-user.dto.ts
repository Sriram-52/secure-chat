import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(User, ['id', 'createdAt', 'updatedAt']),
) {}
