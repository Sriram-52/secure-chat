import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({})
  publicKey: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string | null;
}
