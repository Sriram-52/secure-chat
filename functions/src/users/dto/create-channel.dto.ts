import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ type: [String] })
  members: string[];
}
