import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserSwagger extends UserEntity {
  @ApiProperty()
  avatar_url: string;
}
