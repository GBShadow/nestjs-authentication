import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class IndexTodoSwagger extends UserEntity {
  @ApiProperty()
  avatar_url: string;
}
