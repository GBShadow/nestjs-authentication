import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class ShowUserSwagger extends UserEntity {
  @ApiProperty()
  avatar_url: string;
}
